"use client";

import { useEffect, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ["image/png", "image/jpeg", "image/gif"];

type Props = { avatarUrl?: string; initial: string };

export function AvatarUpload({ avatarUrl, initial }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPT.includes(file.type)) return setError("Use png, jpg or gif");
    if (file.size > MAX_SIZE) return setError("File is larger than 5MB");

    setError(null);
    setPreview(URL.createObjectURL(file));
    // TODO: read as base64 and call the uploadAvatar server action
    // (UploadAvatarInput: { userId, base64, size, type })
  }

  return (
    <div className="flex items-center gap-8">
      <Avatar className="size-24">
        {preview && <AvatarImage src={preview} alt="" />}
        <AvatarFallback className="bg-muted text-3xl text-muted-foreground">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          className="sr-only"
          onChange={onFile}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <UploadIcon className="size-5" />
          Upload avatar image
        </button>
        <p className="mt-1 text-xs text-muted-foreground">
          png, jpg or gif no more than 5MB
        </p>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
