import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { ObjectId, type WithId } from "mongodb";
import { getCollection } from "@/lib/server/mongodb";

export type UserProvider = "password" | "google";

export type UserDocument = {
  name: string;
  email: string;
  avatar?: string;
  provider: UserProvider;
  passwordHash?: string;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: UserProvider;
};

const sessionCookieName = "floaty_session";
const sessionMaxAge = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SECRET || "floaty-dev-secret-change-me";
}

function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function createSessionToken(userId: string) {
  const payload = toBase64Url(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + sessionMaxAge,
    }),
  );
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token?: string) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (!decoded.sub || !decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded.sub;
  } catch {
    return null;
  }
}

export function toPublicUser(user: WithId<UserDocument>): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
  };
}

export function setSessionCookie(userId: string) {
  cookies().set(sessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  });
}

export function clearSessionCookie() {
  cookies().set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionUserId() {
  return verifySessionToken(cookies().get(sessionCookieName)?.value);
}

export async function getSessionUser() {
  const userId = getSessionUserId();
  if (!userId || !ObjectId.isValid(userId)) return null;

  const users = await getCollection<UserDocument>("users");
  const user = await users.findOne({ _id: new ObjectId(userId) });

  return user;
}
