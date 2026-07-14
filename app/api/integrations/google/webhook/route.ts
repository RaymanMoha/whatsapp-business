import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { validateCatalogRows } from "@/src/catalog-import";
import {
   finishGoogleEvent,
   reserveGoogleEvent,
   verifyGoogleWebhookSecret,
} from "@/src/google-integration";
import { importProducts, readProducts } from "@/src/product-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
   const secret = request.headers.get("x-commerce-integration-secret");
   if (!(await verifyGoogleWebhookSecret(secret))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   let eventId = "";
   try {
      const body = await request.json();
      const action = String(body.action || "");
      eventId = String(body.eventId || crypto.randomUUID());
      if (!["import_products", "product_form_submission"].includes(action)) {
         throw new Error("Unknown Google integration action");
      }

      const reservation = await reserveGoogleEvent(eventId, action);
      if (reservation.duplicate) {
         return NextResponse.json({ ok: true, duplicate: true, eventId });
      }

      const rawRows = action === "product_form_submission" ? [body.product] : body.rows;
      if (!Array.isArray(rawRows) || rawRows.length === 0) throw new Error("No product rows were provided");
      if (rawRows.length > 1000) throw new Error("A sync can contain at most 1,000 products");

      const existingProducts = await readProducts();
      const rows = validateCatalogRows(rawRows, existingProducts);
      const invalidRows = rows.filter((row) => !row.valid);
      if (invalidRows.length) {
         const details = invalidRows.slice(0, 20).map((row) => ({ rowNumber: row.rowNumber, errors: row.errors }));
         await finishGoogleEvent(eventId, "rejected", details);
         return NextResponse.json({ error: "Fix invalid product rows", rows: details }, { status: 400 });
      }

      const result = await importProducts(rows);
      await finishGoogleEvent(eventId, "completed", result);
      return NextResponse.json({ ok: true, eventId, result });
   } catch (error) {
      if (eventId) await finishGoogleEvent(eventId, "failed", { error: error instanceof Error ? error.message : "Unknown error" });
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Google webhook could not be processed" },
         { status: 400 },
      );
   }
}
