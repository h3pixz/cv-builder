type JwtPayload = {
  id: number;
  exp?: unknown;
  sub?: unknown;
  email?: unknown;
  role?: unknown;
};

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

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return readString(value);
}

export function getTokenPayload(token: string) {
  const payload = decodePayload(token);

  return {
    sub: readId(payload?.sub),
    email: readString(payload?.email),
    role: readString(payload?.role),
  };
}

export function getTokenSubject(token: string): string | null {
  return getTokenPayload(token).sub;
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
