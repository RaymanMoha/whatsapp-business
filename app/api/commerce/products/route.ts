import { NextRequest, NextResponse } from "next/server";
import { readProducts, updateProductImage } from "@/src/product-store";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export async function GET() {
   return NextResponse.json({ products: await readProducts() });
}

export async function POST(request: NextRequest) {
   try {
      const formData = await request.formData();
      const productId = String(formData.get("productId") || "");
      const file = formData.get("image");
      const remove = formData.get("remove") === "true";

      if (!productId) {
         return NextResponse.json({ error: "Product id is required" }, { status: 400 });
      }

      if (remove) {
         const product = await updateProductImage(productId, null);
         return NextResponse.json({ product });
      }

      if (!(file instanceof File)) {
         return NextResponse.json({ error: "Image file is required" }, { status: 400 });
      }

      if (!file.type.startsWith("image/")) {
         return NextResponse.json({ error: "Upload an image file" }, { status: 400 });
      }

      if (file.size > MAX_IMAGE_BYTES) {
         return NextResponse.json({ error: "Image must be 2MB or smaller" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const product = await updateProductImage(productId, {
         mimetype: file.type,
         filename: file.name || `${productId}.jpg`,
         size: file.size,
         data: buffer.toString("base64"),
      });

      return NextResponse.json({ product });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Product image could not be saved" },
         { status: 400 },
      );
   }
}
