const SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "dev-secret";

function base64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function unbase64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

// simple HMAC-like signature (not a full JWT; enough for unsubscribe links)
import crypto from "crypto";

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function createUnsubscribeToken(email: string) {
  const payload = JSON.stringify({
    email,
    iat: Date.now(),
  });

  const p = base64url(payload);
  const s = sign(p);

  return `${p}.${s}`;
}

export function decodeUnsubscribeToken(token: string): { email: string } | null {
  const [p, s] = token.split(".");
  if (!p || !s) return null;

  const expected = sign(p);
  if (expected !== s) return null;

  try {
    const json = JSON.parse(unbase64url(p));
    if (!json?.email) return null;
    return { email: String(json.email) };
  } catch {
    return null;
  }
}
