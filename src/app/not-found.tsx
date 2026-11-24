"use client";

import { useRouter } from "next/navigation";
import { NotFoundPage } from "@/features/errors";
import { goBack } from "@/shared/helpers/go-back";

export default function NotFound() {
  const router = useRouter();

  return (
    <NotFoundPage
      onGoBack={() => {
        if (!goBack()) {
          router.replace("/");
        }
      }}
    />
  );
}
