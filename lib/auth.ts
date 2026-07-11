"use server"

import { cookies } from "next/headers"
import { jwtVerify, type JWTPayload } from "jose"
import type { Session } from "@/types"

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret")
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return {
      sub: String(payload.sub ?? ""),
      email: String((payload as JWTPayload & { email?: string }).email ?? ""),
      name: String((payload as JWTPayload & { name?: string }).name ?? ""),
    }
  } catch {
    return null
  }
}

export async function isAuthenticated() {
  return (await getSession()) !== null
}
