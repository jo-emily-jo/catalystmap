import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "catalystmap_admin";
const EXPIRY_SECONDS = 60 * 60 * 24; // 24 hours

function getSecret(): Uint8Array {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD not set");
  return new TextEncoder().encode(password);
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_SECONDS}s`)
    .sign(getSecret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: EXPIRY_SECONDS,
    path: "/",
  });
}

export async function validateSession(): Promise<boolean> {
  const cookie = cookies().get(COOKIE_NAME);
  if (!cookie?.value) return false;

  try {
    await jwtVerify(cookie.value, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function clearSession(): void {
  cookies().delete(COOKIE_NAME);
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
