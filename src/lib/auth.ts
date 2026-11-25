import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { LoginToken, Session, User, type UserDoc } from "./models";

export const SESSION_COOKIE = "uc_session";
const SESSION_DAYS = 30;
const LOGIN_TOKEN_MINUTES = 15;
const MAX_LINKS_PER_HOUR = 5;

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("base64url");

/** Create a one-time sign-in token. Returns null when the address is rate limited. */
export async function createLoginToken(email: string): Promise<string | null> {
  await connectDB();
  const recent = await LoginToken.countDocuments({ email, createdAt: { $gt: new Date(Date.now() - 3600_000) } });
  if (recent >= MAX_LINKS_PER_HOUR) return null;
  const token = randomToken();
  await LoginToken.create({
    email,
    tokenHash: sha256(token),
    expiresAt: new Date(Date.now() + LOGIN_TOKEN_MINUTES * 60_000),
  });
  return token;
}

/** Consume a sign-in token; returns the user it signs in, creating the account on first use. */
export async function consumeLoginToken(token: string): Promise<UserDoc | null> {
  await connectDB();
  const record = await LoginToken.findOneAndUpdate(
    { tokenHash: sha256(token), usedAt: null, expiresAt: { $gt: new Date() } },
    { usedAt: new Date() },
  );
  if (!record) return null;
  const user = await User.findOneAndUpdate(
    { email: record.email },
    { $set: { verifiedAt: new Date() }, $setOnInsert: { email: record.email } },
    { upsert: true, returnDocument: "after" },
  );
  return user as UserDoc;
}

export async function startSession(userId: string): Promise<void> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await Session.create({ tokenHash: sha256(token), user: userId, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectDB();
    await Session.deleteOne({ tokenHash: sha256(token) });
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<UserDoc | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await connectDB();
  const session = await Session.findOne({ tokenHash: sha256(token), expiresAt: { $gt: new Date() } }).lean();
  if (!session) return null;
  const user = (await User.findById(session.user).lean()) as UserDoc | null;
  if (!user || user.suspended) return null;
  return user;
}

/** For pages and actions that need a signed-in user with a finished profile. */
export async function requireUser(opts: { allowIncompleteProfile?: boolean } = {}): Promise<UserDoc> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!opts.allowIncompleteProfile && !user.name) redirect("/profile?welcome=1");
  return user;
}

export function isAdmin(user: Pick<UserDoc, "email"> | null): boolean {
  if (!user) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return admins.includes(user.email);
}
