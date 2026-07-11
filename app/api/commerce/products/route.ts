import { NextResponse } from "next/server";
import { commerceProducts } from "@/lib/commerce-data";

export async function GET() {
   return NextResponse.json({ products: commerceProducts });
}
