export const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

export const AVATAR_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
] as const;

export type AvatarMimeType = (typeof AVATAR_ACCEPTED_TYPES)[number];

export const AVATAR_SIZE_ERROR = "File size must not exceed 5MB";
export const AVATAR_TYPE_ERROR = "Use png, jpg or gif";

export function isAcceptedAvatarType(type: string): type is AvatarMimeType {
  return (AVATAR_ACCEPTED_TYPES as readonly string[]).includes(type);
}
