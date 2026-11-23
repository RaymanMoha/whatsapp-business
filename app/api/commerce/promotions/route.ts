import { NextRequest, NextResponse } from "next/server";
import {
   createPromotion,
   deletePromotion,
   readPromotions,
   updatePromotion,
} from "@/src/promotion-store";

export async function GET() {
   return NextResponse.json({ promotions: await readPromotions() });
}

export async function POST(request: NextRequest) {
   try {
      const promotion = await createPromotion(await request.json());
      return NextResponse.json({ promotion }, { status: 201 });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Promotion could not be created" },
         { status: 400 },
      );
   }
}

export async function PATCH(request: NextRequest) {
   try {
      const input = await request.json();
      const promotion = await updatePromotion(input.id, input);
      return NextResponse.json({ promotion });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Promotion could not be updated" },
         { status: 400 },
      );
   }
}

export async function DELETE(request: NextRequest) {
   try {
      await deletePromotion(request.nextUrl.searchParams.get("id"));
      return NextResponse.json({ ok: true });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Promotion could not be deleted" },
         { status: 400 },
      );
   }
}
