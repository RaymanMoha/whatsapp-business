import { NextResponse } from "next/server";
import { listCustomerSummaries } from "@/src/customer-store";

export async function GET() {
   return NextResponse.json({ customers: await listCustomerSummaries() });
}
