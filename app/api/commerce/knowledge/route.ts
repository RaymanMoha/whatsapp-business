import { NextRequest, NextResponse } from "next/server";
import {
   deleteApprovedKnowledge,
   readApprovedKnowledge,
   upsertApprovedKnowledge,
} from "@/src/knowledge-store";

export async function GET() {
   return NextResponse.json({ entries: await readApprovedKnowledge() });
}

export async function POST(request: NextRequest) {
   try {
      const entry = await upsertApprovedKnowledge(await request.json());
      return NextResponse.json({ entry });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Knowledge could not be saved" },
         { status: 400 },
      );
   }
}

export async function DELETE(request: NextRequest) {
   const id = new URL(request.url).searchParams.get("id");
   if (!id) return NextResponse.json({ error: "Knowledge id is required" }, { status: 400 });

   await deleteApprovedKnowledge(id);
   return NextResponse.json({ ok: true });
}
