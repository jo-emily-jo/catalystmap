import { describe, it, expect } from "vitest";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("test-password-123");

describe("session JWT", () => {
  it("sign and verify round-trip succeeds", async () => {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    const { payload } = await jwtVerify(token, SECRET);
    expect(payload.role).toBe("admin");
  });

  it("expired token throws on verify", async () => {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(SECRET);

    await expect(jwtVerify(token, SECRET)).rejects.toThrow();
  });

  it("tampered token throws on verify", async () => {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    const tampered = token.slice(0, -5) + "XXXXX";
    await expect(jwtVerify(tampered, SECRET)).rejects.toThrow();
  });

  it("wrong secret throws on verify", async () => {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    const wrongSecret = new TextEncoder().encode("wrong-password");
    await expect(jwtVerify(token, wrongSecret)).rejects.toThrow();
  });
});
