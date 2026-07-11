import { NextResponse } from "next/server";
import { listOrderIntents } from "@/src/customer-store";

export async function GET() {
   return NextResponse.json({ orders: await listOrderIntents() });
}
