"use server"

import crypto from "node:crypto"
import { cookies, headers } from "next/headers"
import { SignJWT } from "jose"
import { SignInSchema, type SignInValues, type SignUpValues } from "@/types"
import { verifyPassword } from "@/src/auth-password"
import { clearLoginFailures, getLoginLimit, recordLoginFailure } from "@/src/auth-attempt-store"

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET?.trim()
  if ((!secret || secret === "dev-secret" || secret.length < 32) && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be a random value of at least 32 characters")
  }
  return new TextEncoder().encode(secret || "local-development-secret-change-me")
}

async function setSessionCookie(user: { id: string; email: string; fullName: string }) {
  const token = await new SignJWT({ email: user.email, name: user.fullName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret())

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
}

export async function signUpAction(_values: SignUpValues) {
  return { ok: false, error: { formErrors: ["This dashboard is invite-only."], fieldErrors: {} } }
}

export async function signInAction(values: SignInValues) {
  const parsed = SignInSchema.safeParse(values)
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." }

  const requestHeaders = await headers()
  const address = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "local"
  const limit = await getLoginLimit(parsed.data.email, address)
  if (!limit.allowed) {
    return { ok: false, error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.` }
  }

  const adminEmail = process.env.DASHBOARD_ADMIN_EMAIL?.trim().toLowerCase()
  const adminPasswordHash = process.env.DASHBOARD_ADMIN_PASSWORD_HASH?.trim()
  const emailMatches = Boolean(adminEmail) && parsed.data.email.trim().toLowerCase() === adminEmail
  const passwordMatches = Boolean(adminPasswordHash) && verifyPassword(parsed.data.password, adminPasswordHash)

  if (!emailMatches || !passwordMatches) {
    await recordLoginFailure(parsed.data.email, address)
    return { ok: false, error: "Incorrect email or password." }
  }

  await clearLoginFailures(parsed.data.email, address)
  const user = {
    id: crypto.createHash("sha256").update(adminEmail || "admin").digest("hex").slice(0, 32),
    fullName: process.env.DASHBOARD_ADMIN_NAME || "Store Admin",
    email: parsed.data.email,
  }
  await setSessionCookie(user)
  return { ok: true, user }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return { ok: true }
}
