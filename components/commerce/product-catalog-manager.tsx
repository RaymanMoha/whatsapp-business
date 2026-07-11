"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Product = {
   id: string;
   name: string;
   subtitle?: string;
   category: string;
   price: number;
   stock: number;
   available: boolean;
   emoji?: string;
   imageDataUrl?: string;
   image?: {
      filename?: string;
      size?: number;
      updatedAt?: string;
   } | null;
};

function formatPrice(value: number) {
   return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
   }).format(value);
}

export function ProductCatalogManager() {
   const [products, setProducts] = React.useState<Product[]>([]);
   const [loading, setLoading] = React.useState(true);
   const [savingId, setSavingId] = React.useState("");
   const [notice, setNotice] = React.useState("");
   const uploadedImageCount = products.filter((product) => Boolean(product.imageDataUrl)).length;

   async function loadProducts() {
      const response = await fetch("/api/commerce/products", { cache: "no-store" });
      const data = await response.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      setLoading(false);
   }

   async function uploadImage(productId: string, file?: File) {
      if (!file) return;
      setSavingId(productId);
      setNotice("");

      try {
         const formData = new FormData();
         formData.set("productId", productId);
         formData.set("image", file);

         const response = await fetch("/api/commerce/products", {
            method: "POST",
            body: formData,
         });
         const data = await response.json();

         if (!response.ok) throw new Error(data.error || "Image could not be uploaded");

         setNotice("Product image saved. New WhatsApp replies can now include it.");
         await loadProducts();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Image could not be uploaded");
      } finally {
         setSavingId("");
      }
   }

   async function removeImage(productId: string) {
      setSavingId(productId);
      setNotice("");

      try {
         const formData = new FormData();
         formData.set("productId", productId);
         formData.set("remove", "true");

         const response = await fetch("/api/commerce/products", {
            method: "POST",
            body: formData,
         });
         const data = await response.json();

         if (!response.ok) throw new Error(data.error || "Image could not be removed");

         setNotice("Product image removed.");
         await loadProducts();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Image could not be removed");
      } finally {
         setSavingId("");
      }
   }

   React.useEffect(() => {
      loadProducts().catch(() => {
         setLoading(false);
         setNotice("Products could not load.");
      });
   }, []);

   return (
      <Card className="text-black dark:text-black">
         <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
               <div>
                  <CardTitle>Available products</CardTitle>
                  <p className="mt-2 text-sm text-zinc-500">
                     {uploadedImageCount}/{products.length} products have pictures. The bot can only send pictures for products with uploaded images.
                  </p>
               </div>
               {products.length > 0 && uploadedImageCount === 0 ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                     No pictures uploaded
                  </span>
               ) : null}
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            {notice ? <p className="rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{notice}</p> : null}
            {loading ? <p className="text-sm text-zinc-500">Loading products…</p> : null}
            <div className="grid gap-4 lg:grid-cols-2">
               {products.map((product) => (
                  <div key={product.id} className="overflow-hidden rounded-2xl border bg-white">
                     <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 p-4">
                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                           {product.imageDataUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                 src={product.imageDataUrl}
                                 alt={product.name}
                                 className="h-full w-full object-cover"
                              />
                           ) : (
                              <span className="text-4xl">{product.emoji || "📦"}</span>
                           )}
                        </div>
                        <div className="min-w-0">
                           <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                 <strong className="block">{product.name}</strong>
                                 <p className="text-sm text-zinc-500">{product.subtitle}</p>
                              </div>
                              <span
                                 className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    product.available
                                       ? "bg-emerald-50 text-emerald-700"
                                       : "bg-red-50 text-red-700"
                                 }`}>
                                 {product.available ? "Available" : "Sold out"}
                              </span>
                           </div>
                           <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-500">
                              <span>{product.category}</span>
                              <span>{product.stock} stock</span>
                              <span>{formatPrice(product.price)}</span>
                           </div>
                           <div className="mt-4 flex flex-wrap items-center gap-2">
                              <label className="cursor-pointer rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                                 {savingId === product.id ? "Saving…" : product.imageDataUrl ? "Replace image" : "Upload image"}
                                 <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={savingId === product.id}
                                    className="hidden"
                                    onChange={(event) => uploadImage(product.id, event.target.files?.[0])}
                                 />
                              </label>
                              {product.imageDataUrl ? (
                                 <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={savingId === product.id}
                                    onClick={() => removeImage(product.id)}>
                                    Remove
                                 </Button>
                              ) : null}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   );
}
