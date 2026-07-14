"use client";

import * as React from "react";
import Link from "next/link";
import { BadgePercent, CheckCircle2, Download, FileSpreadsheet, ImageIcon, PackagePlus, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";

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

type Promotion = {
   id: string;
   name: string;
   description: string;
   active: boolean;
   scope: "all" | "products" | "categories";
   productIds?: string[];
   categories?: string[];
   startsAt?: string | null;
   endsAt?: string | null;
};

type ImportSummary = {
   total: number;
   valid: number;
   invalid: number;
   added: number;
   updated: number;
};

type ProductForm = {
   name: string;
   subtitle: string;
   category: string;
   price: string;
   stock: string;
   available: boolean;
   emoji: string;
};

const emptyProductForm: ProductForm = {
   name: "",
   subtitle: "",
   category: "",
   price: "",
   stock: "",
   available: true,
   emoji: "📦",
};

function productToForm(product: Product): ProductForm {
   return {
      name: product.name,
      subtitle: product.subtitle || "",
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      available: product.available,
      emoji: product.emoji || "📦",
   };
}

const templateCsv = [
   "id,name,subtitle,category,price,stock,available,emoji",
   "organic-honey-500ml,Organic Honey 500ml,100% natural,Grocery,250,26,Yes,🍯",
   "new-product,New Product,Short product description,Category,100,10,Yes,📦",
].join("\n");

function formatPrice(value: number) {
   return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value)}`;
}

function ProductFormFields({
   form,
   onChange,
   error,
   autoFocus = false,
}: {
   form: ProductForm;
   onChange: <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => void;
   error: string;
   autoFocus?: boolean;
}) {
   return (
      <div className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8">
         <label className="space-y-2 text-sm font-semibold text-zinc-800 sm:col-span-2">
            Product name
            <Input required autoFocus={autoFocus} value={form.name} onChange={(event) => onChange("name", event.target.value)} placeholder="e.g. Classic Canvas Tote" className="h-11 rounded-xl" />
         </label>
         <label className="space-y-2 text-sm font-semibold text-zinc-800">
            Category
            <Input required value={form.category} onChange={(event) => onChange("category", event.target.value)} placeholder="e.g. Bags" className="h-11 rounded-xl" />
         </label>
         <label className="space-y-2 text-sm font-semibold text-zinc-800">
            Display emoji
            <Input value={form.emoji} onChange={(event) => onChange("emoji", event.target.value)} maxLength={8} className="h-11 rounded-xl" />
         </label>
         <label className="space-y-2 text-sm font-semibold text-zinc-800">
            Price (KES)
            <Input required type="number" min="0" step="1" inputMode="numeric" value={form.price} onChange={(event) => onChange("price", event.target.value)} placeholder="0" className="h-11 rounded-xl" />
         </label>
         <label className="space-y-2 text-sm font-semibold text-zinc-800">
            Stock quantity
            <Input required type="number" min="0" step="1" inputMode="numeric" value={form.stock} onChange={(event) => onChange("stock", event.target.value)} placeholder="0" className="h-11 rounded-xl" />
         </label>
         <label className="space-y-2 text-sm font-semibold text-zinc-800 sm:col-span-2">
            Short description
            <Textarea value={form.subtitle} onChange={(event) => onChange("subtitle", event.target.value)} placeholder="What should the assistant tell customers about it?" className="min-h-24 rounded-xl" />
         </label>
         <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
            <div>
               <p className="text-sm font-semibold text-zinc-900">Available to customers</p>
               <p className="mt-1 text-xs text-zinc-500">Products with zero stock are automatically marked sold out.</p>
            </div>
            <Switch checked={form.available} onCheckedChange={(checked) => onChange("available", checked)} aria-label="Available to customers" />
         </div>
         {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p> : null}
      </div>
   );
}

export function ProductCatalogManager({
   initialProducts = [],
   initialPromotions = [],
}: {
   initialProducts?: Product[];
   initialPromotions?: Promotion[];
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
   const [addOpen, setAddOpen] = React.useState(false);
   const [productForm, setProductForm] = React.useState<ProductForm>(emptyProductForm);
   const [creating, setCreating] = React.useState(false);
   const [createError, setCreateError] = React.useState("");
   const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
   const [editForm, setEditForm] = React.useState<ProductForm>(emptyProductForm);
   const [updating, setUpdating] = React.useState(false);
   const [editError, setEditError] = React.useState("");
   const [query, setQuery] = React.useState("");
   const [stockFilter, setStockFilter] = React.useState<"all" | "available" | "low" | "out">("all");
   const uploadedImageCount = products.filter((product) => Boolean(product.imageDataUrl)).length;
   const filteredProducts = products.filter((product) => {
      const matchesQuery = `${product.name} ${product.subtitle || ""} ${product.category} ${product.id}`.toLowerCase().includes(query.toLowerCase());
      const matchesStock = stockFilter === "all" || (stockFilter === "available" ? product.available && product.stock > 5 : stockFilter === "low" ? product.available && product.stock > 0 && product.stock <= 5 : !product.available || product.stock === 0);
      return matchesQuery && matchesStock;
   });
   function promotionsForProduct(product: Product) {
      const now = Date.now();
      return initialPromotions.filter((promotion) => {
         if (!promotion.active) return false;
         if (promotion.startsAt && new Date(promotion.startsAt).getTime() > now) return false;
         if (promotion.endsAt && new Date(promotion.endsAt).getTime() < now) return false;
         if (promotion.scope === "products") return promotion.productIds?.includes(product.id);
         if (promotion.scope === "categories") return promotion.categories?.includes(product.category);
         return true;
      });
   }

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
         if (editingProduct?.id === productId) setEditingProduct(data.product);
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
         if (editingProduct?.id === productId) setEditingProduct(data.product);
         await loadProducts();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Image could not be removed");
      } finally {
         setSavingId("");
      }
   }

   async function deleteCatalogProduct(product: Product) {
      if (!window.confirm(`Delete ${product.name} from the catalog? This cannot be undone.`)) return;
      setSavingId(product.id);
      setNotice("");

      try {
         const response = await fetch(`/api/commerce/products?id=${encodeURIComponent(product.id)}`, { method: "DELETE" });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Product could not be deleted");
         setNotice(`${product.name} deleted from the catalog.`);
         await loadProducts();
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Product could not be deleted");
      } finally {
         setSavingId("");
      }
   }

   function updateProductForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
      setProductForm((current) => ({ ...current, [key]: value }));
   }

   function updateEditForm<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
      setEditForm((current) => ({ ...current, [key]: value }));
   }

   function openProductEditor(product: Product) {
      setEditingProduct(product);
      setEditForm(productToForm(product));
      setEditError("");
   }

   async function updateExistingProduct(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (!editingProduct) return;
      setUpdating(true);
      setEditError("");

      try {
         const response = await fetch("/api/commerce/products", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               id: editingProduct.id,
               ...editForm,
               price: Number(editForm.price),
               stock: Number(editForm.stock),
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Product could not be updated");

         setProducts((current) => current.map((product) => product.id === data.product.id ? data.product : product));
         setNotice(`${data.product.name} updated successfully.`);
         setEditingProduct(null);
      } catch (error) {
         setEditError(error instanceof Error ? error.message : "Product could not be updated");
      } finally {
         setUpdating(false);
      }
   }

   async function createManualProduct(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setCreating(true);
      setCreateError("");

      try {
         const response = await fetch("/api/commerce/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               ...productForm,
               price: Number(productForm.price),
               stock: Number(productForm.stock),
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Product could not be added");

         setNotice(`${data.product.name} added. You can upload its picture from the new catalog card.`);
         setProductForm(emptyProductForm);
         setAddOpen(false);
         await loadProducts();
      } catch (error) {
         setCreateError(error instanceof Error ? error.message : "Product could not be added");
      } finally {
         setCreating(false);
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
      <section className="overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white/80 shadow-[0_24px_70px_rgba(0,63,55,.08)]">
         <div className="border-b border-zinc-200 px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
               <div>
                  <h2 className="font-semibold">Available products</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                     {uploadedImageCount}/{products.length} products have pictures. The bot can only send pictures for products with uploaded images.
                  </p>
               </div>
               <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" size="sm" onClick={() => setAddOpen(true)} className="rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
                     <Plus className="mr-2 size-4" />Add product
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={downloadTemplate} className="rounded-lg !bg-white !text-zinc-900 hover:!bg-zinc-50">
                     <Download className="mr-2 size-4" />Template
                  </Button>
                  <Button type="button" size="sm" onClick={() => setImportOpen((open) => !open)} className="rounded-lg">
                     <Upload className="mr-2 size-4" />Import catalog
                  </Button>
               </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 lg:flex-row lg:items-center lg:justify-between"><div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by product, category or ID…" className="h-11 bg-white pl-9" /></div><div className="flex overflow-x-auto text-xs font-medium text-zinc-500">{([['all', `All ${products.length}`], ['available', 'In stock'], ['low', 'Low stock'], ['out', 'Unavailable']] as const).map(([value,label]) => <button key={value} type="button" onClick={() => setStockFilter(value)} className={`shrink-0 border-b-2 px-4 py-2.5 ${stockFilter === value ? 'border-emerald-700 text-emerald-800' : 'border-transparent'}`}>{label}</button>)}</div></div>
         </div>
         <div className="space-y-4 p-5 sm:p-6">
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
               {filteredProducts.map((product) => (
                  <div key={product.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-emerald-300 hover:shadow-[0_14px_35px_rgba(0,63,55,.08)]">
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
                              <ImageIcon className="size-7 text-zinc-400" />
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
                           {promotionsForProduct(product).length ? <div className="mt-2 flex flex-wrap gap-1.5">{promotionsForProduct(product).slice(0, 2).map((promotion) => <span key={promotion.id} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700"><BadgePercent className="size-3" />{promotion.name}</span>)}</div> : null}
                           <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-500">
                              <span>{product.category}</span>
                              <span className={product.stock === 0 ? "font-semibold text-red-600" : product.stock <= 5 ? "font-semibold text-amber-700" : "text-emerald-700"}>{product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `${product.stock} low stock` : `${product.stock} in stock`}</span>
                              <span>{formatPrice(product.price)}</span>
                           </div>
                           <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 className="border-emerald-200 !bg-emerald-50 !text-emerald-800 hover:!bg-emerald-100"
                                 disabled={savingId === product.id}
                                 onClick={() => openProductEditor(product)}>
                                 <Pencil className="mr-1.5 size-4" />Edit product
                              </Button>
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
                                    className="!bg-white !text-zinc-900 hover:!bg-zinc-50"
                                    disabled={savingId === product.id}
                                    onClick={() => removeImage(product.id)}>
                                    Remove image
                                 </Button>
                              ) : null}
                              <Button type="button" variant="ghost" size="sm" disabled={savingId === product.id} onClick={() => deleteCatalogProduct(product)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                 <Trash2 className="mr-1.5 size-4" />Delete product
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
               {!loading && filteredProducts.length === 0 ? <div className="col-span-full grid min-h-64 place-items-center rounded-2xl border border-dashed border-zinc-300 text-center"><div><Search className="mx-auto size-6 text-zinc-400" /><p className="mt-3 text-sm font-medium">No products match this view</p><button type="button" onClick={() => { setQuery(''); setStockFilter('all'); }} className="mt-2 text-sm font-semibold text-emerald-700">Clear filters</button></div></div> : null}
            </div>
         </div>
         <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) setCreateError(""); }}>
            <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-[28px] border-0 bg-white shadow-2xl">
               <form onSubmit={createManualProduct}>
                  <DialogHeader className="border-b border-zinc-100 bg-[#073f36] px-6 py-6 text-white sm:px-8">
                     <div className="flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-300 text-emerald-950"><PackagePlus className="size-5" /></span>
                        <div>
                           <h2 className="text-xl font-semibold">Add a product</h2>
                           <p className="mt-1 text-sm leading-6 text-white/65">Create one catalog item manually. Its product ID is generated safely from the name.</p>
                        </div>
                     </div>
                  </DialogHeader>

                  <ProductFormFields form={productForm} onChange={updateProductForm} error={createError} autoFocus />

                  <DialogFooter className="border-t border-zinc-100 px-6 py-5 sm:px-8">
                     <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={creating}>Cancel</Button>
                     <Button type="submit" disabled={creating} className="bg-emerald-700 text-white hover:bg-emerald-800">
                        <PackagePlus className="mr-2 size-4" />{creating ? "Adding…" : "Add product"}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
         <Dialog open={Boolean(editingProduct)} onOpenChange={(open) => { if (!open) { setEditingProduct(null); setEditError(""); } }}>
            <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-[28px] border-0 bg-white shadow-2xl">
               {editingProduct ? (
                  <form onSubmit={updateExistingProduct}>
                     <DialogHeader className="border-b border-zinc-100 bg-[#073f36] px-6 py-6 text-white sm:px-8">
                        <div className="flex items-start gap-4">
                           <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-300 text-emerald-950"><Pencil className="size-5" /></span>
                           <div>
                              <h2 className="text-xl font-semibold">Edit product</h2>
                              <p className="mt-1 text-sm leading-6 text-white/65">Update what customers see and what the assistant can sell. The product ID stays unchanged.</p>
                           </div>
                        </div>
                     </DialogHeader>

                     <div className="border-b border-zinc-100 px-6 py-5 sm:px-8">
                        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
                           <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                              {editingProduct.imageDataUrl ? (
                                 // eslint-disable-next-line @next/next/no-img-element
                                 <img src={editingProduct.imageDataUrl} alt={editingProduct.name} className="h-full w-full object-cover" />
                              ) : (
                                 <ImageIcon className="size-6 text-zinc-400" />
                              )}
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-zinc-900">Product picture</p>
                              <p className="mt-1 text-xs leading-5 text-zinc-500">Used when the assistant shows this product to customers.</p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                 <label className="cursor-pointer rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
                                    {savingId === editingProduct.id ? "Saving…" : editingProduct.imageDataUrl ? "Replace picture" : "Upload picture"}
                                    <Input type="file" accept="image/*" disabled={savingId === editingProduct.id} className="hidden" onChange={(event) => uploadImage(editingProduct.id, event.target.files?.[0])} />
                                 </label>
                                 {editingProduct.imageDataUrl ? (
                                    <Button type="button" variant="outline" size="sm" disabled={savingId === editingProduct.id} onClick={() => removeImage(editingProduct.id)} className="!bg-white !text-zinc-800">Remove picture</Button>
                                 ) : null}
                              </div>
                           </div>
                        </div>
                     </div>

                     <ProductFormFields form={editForm} onChange={updateEditForm} error={editError} autoFocus />

                     <section className="border-t border-zinc-100 px-6 py-5 sm:px-8">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                           <div><h3 className="text-sm font-semibold text-zinc-950">Promotions</h3><p className="mt-1 text-xs leading-5 text-zinc-500">Active offers currently eligible for this product.</p></div>
                           <Button asChild type="button" variant="outline" size="sm" className="border-violet-200 !bg-violet-50 !text-violet-800 hover:!bg-violet-100"><Link href="/dashboard/promotions"><BadgePercent className="mr-1.5 size-4" />Manage promotions</Link></Button>
                        </div>
                        <div className="mt-4 space-y-2">
                           {promotionsForProduct(editingProduct).map((promotion) => <div key={promotion.id} className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3"><BadgePercent className="mt-0.5 size-4 shrink-0 text-violet-700" /><div><strong className="block text-sm text-zinc-900">{promotion.name}</strong><p className="mt-0.5 text-xs leading-5 text-zinc-500">{promotion.description}</p></div></div>)}
                           {promotionsForProduct(editingProduct).length === 0 ? <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">No active promotion includes this product.</p> : null}
                        </div>
                     </section>

                     <DialogFooter className="sticky bottom-0 border-t border-zinc-100 bg-white px-6 py-5 sm:px-8">
                        <Button type="button" variant="outline" onClick={() => setEditingProduct(null)} disabled={updating}>Cancel</Button>
                        <Button type="submit" disabled={updating || savingId === editingProduct.id} className="bg-emerald-700 text-white hover:bg-emerald-800">
                           <Pencil className="mr-2 size-4" />{updating ? "Saving…" : "Save changes"}
                        </Button>
                     </DialogFooter>
                  </form>
               ) : null}
            </DialogContent>
         </Dialog>
      </section>
   );
}
