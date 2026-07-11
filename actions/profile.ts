"use server"

import { cookies } from "next/headers"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
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

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2))
  }
}

type StoredUser = {
  id: string
  fullName: string
  email: string
  passwordHash: string
  createdAt: string
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureDataFile()
  const raw = await fs.readFile(USERS_FILE, "utf-8")
  const parsed = JSON.parse(raw) as { users: StoredUser[] }
  return Array.isArray(parsed.users) ? parsed.users : []
}

async function writeUsers(users: StoredUser[]) {
  await ensureDataFile()
  await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2))
}

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex")
}

export async function getProfileAction(): Promise<
  | { ok: true; profile: { firstName: string; lastName: string; email: string } }
  | { ok: false; error: string }
> {
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }
  const users = await readUsers()
  const user = users.find((u) => u.id === uid)
  if (!user) return { ok: false, error: "User not found" }
  const [firstName = "", ...rest] = user.fullName.split(" ")
  const lastName = rest.join(" ")
  return { ok: true, profile: { firstName, lastName, email: user.email } }
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
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }

  const firstName = (input.firstName ?? "").trim()
  const lastName = (input.lastName ?? "").trim()
  const email = (input.email ?? "").trim()
  if (!firstName || !lastName) return { ok: false, error: "Name is required" }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Valid email is required" }
  const wantsPasswordChange = Boolean(input.newPassword || input.confirmNewPassword)

  const users = await readUsers()
  const idx = users.findIndex((u) => u.id === uid)
  if (idx === -1) return { ok: false, error: "User not found" }

  if (wantsPasswordChange) {
    const np = String(input.newPassword ?? "")
    const cp = String(input.confirmNewPassword ?? "")
    if (np.length < 8) return { ok: false, error: "Password must be at least 8 characters" }
    if (np !== cp) return { ok: false, error: "Passwords do not match" }
    // Validate current password
    const currentPw = String(input.currentPassword ?? "")
    if (!currentPw) return { ok: false, error: "Current password is required" }
    const userForPw = users[idx]
    if (userForPw.passwordHash !== hashPassword(currentPw)) {
      return { ok: false, error: "Current password is incorrect" }
    }
  }

  // Ensure email is unique if changed
  const emailOwner = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (emailOwner && emailOwner.id !== uid) return { ok: false, error: "Email already in use" }

  const user = users[idx]
  const fullName = `${firstName} ${lastName}`.trim()
  const next: StoredUser = {
    ...user,
    fullName,
    email,
    passwordHash: wantsPasswordChange ? hashPassword(String(input.newPassword)) : user.passwordHash,
  }
  users[idx] = next
  await writeUsers(users)
  return { ok: true }
}

export async function deleteAccountAction(): Promise<{ ok: boolean; error?: string }> {
  const uid = await getUserIdFromSession()
  if (!uid) return { ok: false, error: "Not authenticated" }
  const users = await readUsers()
  const next = users.filter((u) => u.id !== uid)
  if (next.length === users.length) return { ok: false, error: "User not found" }
  await writeUsers(next)
  // clear session cookie
  const cookieStore = await cookies()
  cookieStore.set("session", "", { path: "/", httpOnly: true, maxAge: 0, sameSite: "lax", secure: process.env.NODE_ENV === "production" })
  return { ok: true }
}
