import { NextResponse } from "next/server";
import { syncGoogleWorkspace } from "@/src/google-integration";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
   try {
      return NextResponse.json({ ok: true, ...(await syncGoogleWorkspace()) });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Google sync could not be completed" },
         { status: 400 },
      );
   }
}
