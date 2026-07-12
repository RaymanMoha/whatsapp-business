import { Readable } from "node:stream";
import ExcelJS from "exceljs";
import { NextRequest, NextResponse } from "next/server";
import { validateCatalogRows, CATALOG_COLUMNS } from "@/src/catalog-import";
import { importProducts, readProducts } from "@/src/product-store";

export const runtime = "nodejs";

const MAX_CATALOG_BYTES = 5 * 1024 * 1024;
const MAX_CATALOG_ROWS = 1000;

function cellValue(cell: ExcelJS.Cell) {
   return cell.text.trim();
}

async function parseWorkbook(file: File) {
   const workbook = new ExcelJS.Workbook();
   const buffer = Buffer.from(await file.arrayBuffer());
   const extension = file.name.toLowerCase().split(".").at(-1);

   let worksheet: ExcelJS.Worksheet | undefined;
   if (extension === "csv") {
      worksheet = await workbook.csv.read(Readable.from(buffer));
   } else {
      await workbook.xlsx.load(buffer as never);
      worksheet = workbook.worksheets[0];
   }

   if (!worksheet || worksheet.rowCount < 2) throw new Error("The catalog has no product rows");

   const headers = new Map<string, number>();
   worksheet.getRow(1).eachCell((cell, column) => {
      headers.set(cellValue(cell).toLowerCase().replace(/\s+/g, ""), column);
   });

   const missingHeaders = CATALOG_COLUMNS.filter((column) => !headers.has(column));
   if (missingHeaders.length) throw new Error(`Missing columns: ${missingHeaders.join(", ")}`);

   const rows: Array<Record<string, string | number>> = [];
   worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = Object.fromEntries(
         CATALOG_COLUMNS.map((column) => [column, cellValue(row.getCell(headers.get(column)!))]),
      );
      if (!Object.values(values).some(Boolean)) return;
      rows.push({ ...values, rowNumber });
   });

   if (rows.length > MAX_CATALOG_ROWS) throw new Error(`Catalogs are limited to ${MAX_CATALOG_ROWS} products`);
   return rows;
}

export async function POST(request: NextRequest) {
   try {
      const formData = await request.formData();
      const file = formData.get("catalog");
      const apply = formData.get("apply") === "true";

      if (!(file instanceof File)) throw new Error("Choose an Excel or CSV catalog");
      if (file.size > MAX_CATALOG_BYTES) throw new Error("Catalog must be 5MB or smaller");
      if (!/\.(xlsx|csv)$/i.test(file.name)) throw new Error("Use an .xlsx or .csv file");

      const [rawRows, existingProducts] = await Promise.all([parseWorkbook(file), readProducts()]);
      const rows = validateCatalogRows(rawRows, existingProducts);
      const validRows = rows.filter((row) => row.valid);
      const invalidRows = rows.filter((row) => !row.valid);

      if (apply && invalidRows.length) {
         return NextResponse.json(
            { error: "Fix the invalid rows before importing", rows, summary: summarize(rows) },
            { status: 400 },
         );
      }

      const result = apply ? await importProducts(validRows) : null;
      return NextResponse.json({ rows, summary: summarize(rows), result });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Catalog could not be read" },
         { status: 400 },
      );
   }
}

function summarize(rows: Array<{ valid: boolean; action: string }>) {
   return {
      total: rows.length,
      valid: rows.filter((row) => row.valid).length,
      invalid: rows.filter((row) => !row.valid).length,
      added: rows.filter((row) => row.valid && row.action === "Add").length,
      updated: rows.filter((row) => row.valid && row.action === "Update").length,
   };
}
