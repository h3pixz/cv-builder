export function decodeTokenEmail(token: string): string | null {
  try {
    const payload = token.split(".")[1]

    if (!payload) {
      return null
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { email?: unknown }

    return typeof data.email === "string" ? data.email : null
  } catch {
    return null
  }
}
