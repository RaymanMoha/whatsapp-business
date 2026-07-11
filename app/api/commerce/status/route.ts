import { NextResponse } from "next/server";
import { getCommerceRuntimeStatus } from "@/lib/commerce-runtime";

export async function GET() {
   return NextResponse.json(await getCommerceRuntimeStatus());
}
