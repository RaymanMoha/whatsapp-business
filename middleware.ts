import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-secret")
}

async function hasValidSession(req: NextRequest) {
  const token = req.cookies.get("session")?.value
  if (!token) return false
  try {
    await jwtVerify(token, getJwtSecret())
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAuthed = await hasValidSession(req)

  // Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthed) {
      const url = req.nextUrl.clone()
      url.pathname = "/signin"
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Prevent visiting auth pages when already signed in
  if (pathname === "/" || pathname.startsWith("/signin")) {
    if (isAuthed) {
      const url = req.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/signin", "/dashboard/:path*"],
}

