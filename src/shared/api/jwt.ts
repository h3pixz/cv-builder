type JwtPayload = { exp?: unknown };

function decodePayload(token: string): JwtPayload | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 0): boolean {
  const payload = decodePayload(token);

  if (!payload) {
    return true;
  }

  if (typeof payload.exp !== "number") {
    return false;
  }

  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}
