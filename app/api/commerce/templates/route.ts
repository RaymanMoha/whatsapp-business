import { NextRequest, NextResponse } from "next/server";
import {
   deleteMessageTemplate,
   readMessageTemplates,
   upsertMessageTemplate,
} from "@/src/template-store";

export async function GET() {
   return NextResponse.json({ templates: await readMessageTemplates() });
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const template = await upsertMessageTemplate(body);
      return NextResponse.json({ template });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Template could not be saved" },
         { status: 400 },
      );
   }
}

export async function DELETE(request: NextRequest) {
   const { searchParams } = new URL(request.url);
   const id = searchParams.get("id");

   if (!id) {
      return NextResponse.json({ error: "Template id is required" }, { status: 400 });
   }

   await deleteMessageTemplate(id);
   return NextResponse.json({ ok: true });
}
