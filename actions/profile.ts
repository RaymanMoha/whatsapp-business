"use server"

import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import type { JWTPayload } from "jose"

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret")
}

async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return String(payload.sub ?? "") || null
  } catch {
    return null
  }
}

export async function getProfileAction(): Promise<
  | { ok: true; profile: { firstName: string; lastName: string; email: string } }
  | { ok: false; error: string }
> {
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }
  const fullName = process.env.DASHBOARD_ADMIN_NAME || "Store Admin"
  const email = process.env.DASHBOARD_ADMIN_EMAIL || ""
  const [firstName = "", ...rest] = fullName.split(" ")
  const lastName = rest.join(" ")
  return { ok: true, profile: { firstName, lastName, email } }
}

export async function updateProfileAction(input: {
  firstName: string
  lastName: string
  email: string
  currentPassword?: string | null
  newPassword?: string | null
  confirmNewPassword?: string | null
}): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  void input
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }
  return { ok: false, error: "Profile credentials are managed through secure deployment settings." }
}

export async function deleteAccountAction(): Promise<{ ok: boolean; error?: string }> {
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }
  return { ok: false, error: "The production administrator cannot be deleted from the dashboard." }
}
