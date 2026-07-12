"use client";

import * as React from "react";
import { CheckCircle2, Download, FileSpreadsheet, Upload, X } from "lucide-react";
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

type ImportRow = Product & {
   rowNumber: number;
   action: "Add" | "Update";
   errors: string[];
   valid: boolean;
};

type ImportSummary = {
   total: number;
   valid: number;
   invalid: number;
   added: number;
   updated: number;
};

const templateCsv = [
   "id,name,subtitle,category,price,stock,available,emoji",
   "organic-honey-500ml,Organic Honey 500ml,100% natural,Grocery,250,26,Yes,🍯",
   "new-product,New Product,Short product description,Category,100,10,Yes,📦",
].join("\n");

function formatPrice(value: number) {
   return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
   }).format(value);
}

export function ProductCatalogManager({
   initialProducts = [],
}: {
   initialProducts?: Product[];
}) {
   const [products, setProducts] = React.useState<Product[]>(initialProducts);
   const [loading, setLoading] = React.useState(initialProducts.length === 0);
   const [savingId, setSavingId] = React.useState("");
   const [notice, setNotice] = React.useState("");
   const [importOpen, setImportOpen] = React.useState(false);
   const [catalogFile, setCatalogFile] = React.useState<File | null>(null);
   const [importRows, setImportRows] = React.useState<ImportRow[]>([]);
   const [importSummary, setImportSummary] = React.useState<ImportSummary | null>(null);
   const [importing, setImporting] = React.useState(false);
   const [importError, setImportError] = React.useState("");
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

   function downloadTemplate() {
      const blob = new Blob([`\uFEFF${templateCsv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "whatsapp-commerce-catalog-template.csv";
      anchor.click();
      URL.revokeObjectURL(url);
   }

   async function previewCatalog(file?: File) {
      if (!file) return;
      setCatalogFile(file);
      setImporting(true);
      setImportError("");
      setImportRows([]);
      setImportSummary(null);

      try {
         const formData = new FormData();
         formData.set("catalog", file);
         const response = await fetch("/api/commerce/products/import", { method: "POST", body: formData });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Catalog could not be read");
         setImportRows(data.rows || []);
         setImportSummary(data.summary || null);
      } catch (error) {
         setImportError(error instanceof Error ? error.message : "Catalog could not be read");
      } finally {
         setImporting(false);
      }
   }

   async function applyCatalog() {
      if (!catalogFile || !importSummary || importSummary.invalid > 0) return;
      setImporting(true);
      setImportError("");

      try {
         const formData = new FormData();
         formData.set("catalog", catalogFile);
         formData.set("apply", "true");
         const response = await fetch("/api/commerce/products/import", { method: "POST", body: formData });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Catalog could not be imported");

         setNotice(`Catalog updated: ${data.result.added} added and ${data.result.updated} updated. Existing pictures were preserved.`);
         setImportOpen(false);
         setCatalogFile(null);
         setImportRows([]);
         setImportSummary(null);
         await loadProducts();
      } catch (error) {
         setImportError(error instanceof Error ? error.message : "Catalog could not be imported");
      } finally {
         setImporting(false);
      }
   }

   React.useEffect(() => {
      if (initialProducts.length > 0) return;
      loadProducts().catch(() => {
         setLoading(false);
         setNotice("Products could not load.");
      });
   }, [initialProducts.length]);

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
               <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={downloadTemplate} className="rounded-lg">
                     <Download className="mr-2 size-4" />Template
                  </Button>
                  <Button type="button" size="sm" onClick={() => setImportOpen((open) => !open)} className="rounded-lg">
                     <Upload className="mr-2 size-4" />Import catalog
                  </Button>
               </div>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            {importOpen ? (
               <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/40">
                  <div className="relative border-b border-emerald-100 p-4 sm:flex sm:items-start sm:gap-3 sm:p-5">
                     <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm sm:grid"><FileSpreadsheet className="size-5" /></span>
                     <div className="min-w-0 pr-9 sm:pr-0">
                           <h3 className="font-semibold text-zinc-950">Update the catalog from Excel</h3>
                           <p className="mt-1 text-sm leading-6 text-zinc-600">Upload `.xlsx` or `.csv`. Matching IDs update products; new IDs add products. Existing pictures and products not listed in the file remain unchanged.</p>
                     </div>
                     <Button type="button" variant="ghost" size="icon" onClick={() => setImportOpen(false)} aria-label="Close catalog importer" className="absolute right-2 top-2 sm:right-3 sm:top-3"><X className="size-4" /></Button>
                  </div>

                  <div className="space-y-4 p-5">
                     <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-emerald-300 bg-white px-6 py-7 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30">
                        <Upload className="size-6 text-emerald-700" />
                        <strong className="mt-3 text-sm text-zinc-900">{catalogFile ? catalogFile.name : "Choose an Excel or CSV catalog"}</strong>
                        <span className="mt-1 text-xs text-zinc-500">Maximum 1,000 products · 5MB</span>
                        <Input type="file" accept=".xlsx,.csv" className="hidden" onChange={(event) => previewCatalog(event.target.files?.[0])} />
                     </label>

                     {importing ? <p role="status" className="text-sm font-medium text-emerald-800">Checking catalog…</p> : null}
                     {importError ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{importError}</p> : null}

                     {importSummary ? (
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {[
                                 ["Products", importSummary.total],
                                 ["New", importSummary.added],
                                 ["Updates", importSummary.updated],
                                 ["Needs fixing", importSummary.invalid],
                              ].map(([label, value]) => (
                                 <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3"><strong className="block text-lg text-zinc-950">{value}</strong><span className="text-xs text-zinc-500">{label}</span></div>
                              ))}
                           </div>

                           <div className="max-h-72 overflow-auto rounded-xl border border-zinc-200 bg-white">
                              <table className="w-full min-w-[760px] text-left text-sm">
                                 <thead className="sticky top-0 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                                    <tr><th className="px-4 py-3">Row</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Result</th></tr>
                                 </thead>
                                 <tbody className="divide-y divide-zinc-100">
                                    {importRows.map((row) => (
                                       <tr key={`${row.rowNumber}-${row.id}`} className={row.valid ? "" : "bg-red-50/60"}>
                                          <td className="px-4 py-3 text-zinc-500">{row.rowNumber}</td>
                                          <td className="px-4 py-3"><strong className="block text-zinc-900">{row.name || "Missing name"}</strong><span className="text-xs text-zinc-500">{row.id || "No ID"}</span></td>
                                          <td className="px-4 py-3 text-zinc-600">{row.category || "—"}</td>
                                          <td className="px-4 py-3 text-zinc-600">{formatPrice(row.price)}</td>
                                          <td className="px-4 py-3 text-zinc-600">{row.stock}</td>
                                          <td className="px-4 py-3">{row.valid ? <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700"><CheckCircle2 className="size-4" />{row.action}</span> : <span className="text-xs font-medium text-red-700">{row.errors.join(" · ")}</span>}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>

                           <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-xs leading-5 text-zinc-500">Imports merge by product ID and never remove product pictures.</p>
                              <Button type="button" disabled={importing || importSummary.invalid > 0 || importSummary.valid === 0} onClick={applyCatalog} className="rounded-lg">
                                 <Upload className="mr-2 size-4" />{importing ? "Importing…" : `Import ${importSummary.valid} ${importSummary.valid === 1 ? "product" : "products"}`}
                              </Button>
                           </div>
                        </div>
                     ) : null}
                  </div>
               </section>
            ) : null}
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
