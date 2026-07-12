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
  const isProtectedApi =
    (pathname.startsWith("/api/commerce") && pathname !== "/api/commerce/payments/callback") ||
    pathname === "/api/chat"

  if (isProtectedApi && !isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
      const next = req.nextUrl.searchParams.get("next")
      url.pathname = next?.startsWith("/dashboard") ? next : "/dashboard"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/signin", "/dashboard/:path*", "/api/chat", "/api/commerce/:path*"],
}
