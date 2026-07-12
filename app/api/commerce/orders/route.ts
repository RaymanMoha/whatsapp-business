import { NextRequest, NextResponse } from "next/server";
import { listOrders, updateOrderStatus } from "@/src/order-store";

export async function GET() {
   return NextResponse.json({ orders: await listOrders() });
}

export async function PATCH(request: NextRequest) {
   try {
      const body = await request.json();
      const order = await updateOrderStatus(String(body.id || ""), String(body.status || ""));
      return NextResponse.json({ order });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Order could not be updated" },
         { status: 400 },
      );
   }
}
