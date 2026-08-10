import { NextRequest, NextResponse } from "next/server";
import {
   getWhatsappConnectionState,
   manageWhatsappSession,
   WahaSessionError,
} from "@/src/waha-session";

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
   const status = error instanceof WahaSessionError ? error.status : 500;
   return NextResponse.json(
      { error: error instanceof Error ? error.message : "WhatsApp session request failed" },
      { status },
   );
}

export async function GET(request: NextRequest) {
   try {
      const includeQr = request.nextUrl.searchParams.get("qr") === "1";
      return NextResponse.json(await getWhatsappConnectionState({ includeQr }));
   } catch (error) {
      return errorResponse(error);
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json().catch(() => ({}));
      const action = String(body.action || "");

      if (action === "logout" && body.confirm !== "disconnect") {
         return NextResponse.json(
            { error: "Type disconnect to confirm WhatsApp logout" },
            { status: 400 },
         );
      }

      return NextResponse.json(await manageWhatsappSession(action));
   } catch (error) {
      return errorResponse(error);
   }
}
