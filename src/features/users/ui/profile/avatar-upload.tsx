"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { toast } from "@/shared/ui/toast";

import { uploadAvatarAction } from "../../api/profile.actions";
import {
  AVATAR_ACCEPTED_TYPES,
  AVATAR_MAX_SIZE,
  AVATAR_SIZE_ERROR,
  AVATAR_TYPE_ERROR,
  isAcceptedAvatarType,
} from "../../model/avatar";

type Props = {
  userId: string;
  avatarUrl?: string;
  initial: string;
};

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unexpected file reader result"));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));

    reader.readAsDataURL(file);
  });
}

export function AvatarUpload({ userId, avatarUrl, initial }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function upload(file: File) {
    setError(null);
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      let base64: string;
      try {
        base64 = await readAsDataUrl(file);
      } catch {
        throw new Error("Could not read the selected file");
      }

      const result = await uploadAvatarAction(userId, {
        base64,
        size: file.size,
        type: file.type,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setPreview(result.url);
      toast.add({
        type: "success",
        title: "Avatar updated",
        description: "The avatar image has been updated.",
      });
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not upload the avatar";

      setError(message);
      setPreview(avatarUrl);
      toast.add({
        type: "error",
        title: "Could not upload the avatar",
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];

    input.value = "";
    if (!file) return;

    if (!isAcceptedAvatarType(file.type)) {
      setError(AVATAR_TYPE_ERROR);
      return;
    }

    if (file.size > AVATAR_MAX_SIZE) {
      setError(AVATAR_SIZE_ERROR);
      return;
    }

    void upload(file);
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-24">
        {preview && <AvatarImage src={preview} alt="" />}
        <AvatarFallback className="bg-muted text-3xl text-muted-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <input
          ref={inputRef}
          type="file"
          accept={AVATAR_ACCEPTED_TYPES.join(",")}
          aria-label="Upload avatar image"
          className="sr-only"
          onChange={onFile}
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          aria-busy={isUploading}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:text-disabled-foreground"
        >
          <UploadIcon className="size-5" aria-hidden="true" />
          {isUploading ? "Uploading..." : "Upload avatar image"}
        </button>
        <p className="mt-1 text-xs text-muted-foreground">
          png, jpg or gif no more than 5MB
        </p>
        {error && (
          <p role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
