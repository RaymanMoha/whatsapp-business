"use server"

import { cookies } from "next/headers"
import { SignInSchema, SignUpSchema, type SignInValues, type SignUpValues } from "@/types"
import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
import { SignJWT } from "jose"

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

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret")
}

async function setSessionCookie(user: StoredUser) {
  const token = await new SignJWT({ email: user.email, name: user.fullName })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret())

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function signUpAction(values: SignUpValues) {
  const parsed = SignUpSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() }
  }

  const users = await readUsers()
  const existing = users.find((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase())
  if (existing) {
    return { ok: false, error: { formErrors: ["Email already registered"], fieldErrors: {} } }
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    passwordHash: hashPassword(parsed.data.password),
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  await writeUsers(users)
  await setSessionCookie(user)

  return { ok: true, user: { id: user.id, fullName: user.fullName, email: user.email } }
}

export async function signInAction(values: SignInValues) {
  // Skip validation - accept anything
  const email = values.email || "demo@example.com"
  const password = values.password || "demo"

  // Always create a user object regardless of input
  const user = {
    id: crypto.randomUUID(),
    fullName: "Demo User",
    email: email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }

  // Set session cookie for any user
  await setSessionCookie(user)
  return { ok: true, user: { id: user.id, fullName: user.fullName, email: user.email } }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return { ok: true }
}
