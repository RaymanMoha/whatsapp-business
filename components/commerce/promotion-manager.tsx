"use client";

import * as React from "react";
import {
   BadgePercent,
   CalendarClock,
   Check,
   CircleDollarSign,
   Clock3,
   Gift,
   Layers3,
   PackageCheck,
   PauseCircle,
   Plus,
   Save,
   Search,
   Sparkles,
   Trash2,
   UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type PromotionType = "percentage" | "fixed" | "buy_x_get_y";
type PromotionScope = "all" | "products" | "categories";

type Promotion = {
   id: string;
   name: string;
   description: string;
   type: PromotionType;
   value: number;
   buyQuantity?: number | null;
   getQuantity?: number | null;
   minimumSpend: number;
   startsAt?: string | null;
   endsAt?: string | null;
   active: boolean;
   scope: PromotionScope;
   productIds: string[];
   categories: string[];
   redemptionLimit?: number | null;
   redemptionCount: number;
   createdAt: string;
   updatedAt: string;
};

type Product = { id: string; name: string; category: string; price: number; available: boolean };

type Draft = {
   id?: string;
   name: string;
   description: string;
   type: PromotionType;
   value: string;
   buyQuantity: string;
   getQuantity: string;
   minimumSpend: string;
   startsAt: string;
   endsAt: string;
   active: boolean;
   scope: PromotionScope;
   productIds: string[];
   categories: string[];
   redemptionLimit: string;
};

const emptyDraft: Draft = {
   name: "",
   description: "",
   type: "percentage",
   value: "10",
   buyQuantity: "1",
   getQuantity: "1",
   minimumSpend: "0",
   startsAt: "",
   endsAt: "",
   active: true,
   scope: "all",
   productIds: [],
   categories: [],
   redemptionLimit: "",
};

function toLocalInput(value?: string | null) {
   if (!value) return "";
   const date = new Date(value);
   if (Number.isNaN(date.getTime())) return "";
   const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
   return local.toISOString().slice(0, 16);
}

function toDraft(promotion: Promotion): Draft {
   return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      value: String(promotion.value || 0),
      buyQuantity: String(promotion.buyQuantity || 1),
      getQuantity: String(promotion.getQuantity || 1),
      minimumSpend: String(promotion.minimumSpend || 0),
      startsAt: toLocalInput(promotion.startsAt),
      endsAt: toLocalInput(promotion.endsAt),
      active: promotion.active,
      scope: promotion.scope,
      productIds: promotion.productIds || [],
      categories: promotion.categories || [],
      redemptionLimit: promotion.redemptionLimit ? String(promotion.redemptionLimit) : "",
   };
}

function promotionStatus(promotion: Promotion) {
   const now = Date.now();
   if (!promotion.active) return { label: "Paused", tone: "bg-zinc-100 text-zinc-600", icon: PauseCircle };
   if (promotion.redemptionLimit && promotion.redemptionCount >= promotion.redemptionLimit) return { label: "Limit reached", tone: "bg-amber-50 text-amber-800", icon: UsersRound };
   if (promotion.startsAt && new Date(promotion.startsAt).getTime() > now) return { label: "Scheduled", tone: "bg-violet-50 text-violet-700", icon: CalendarClock };
   if (promotion.endsAt && new Date(promotion.endsAt).getTime() < now) return { label: "Ended", tone: "bg-red-50 text-red-700", icon: Clock3 };
   return { label: "Live", tone: "bg-emerald-50 text-emerald-800", icon: Sparkles };
}

function offerLabel(promotion: Pick<Promotion, "type" | "value" | "buyQuantity" | "getQuantity"> | Draft) {
   if (promotion.type === "percentage") return `${Number(promotion.value || 0)}% off`;
   if (promotion.type === "fixed") return `KES ${Number(promotion.value || 0).toLocaleString("en-KE")} off`;
   return `Buy ${Number(promotion.buyQuantity || 1)}, get ${Number(promotion.getQuantity || 1)} free`;
}

function scopeLabel(promotion: Promotion) {
   if (promotion.scope === "products") return `${promotion.productIds.length} selected product${promotion.productIds.length === 1 ? "" : "s"}`;
   if (promotion.scope === "categories") return promotion.categories.join(", ");
   return "Entire catalog";
}

export function PromotionManager({ initialPromotions, products }: { initialPromotions: Promotion[]; products: Product[] }) {
   const [promotions, setPromotions] = React.useState(initialPromotions);
   const [selectedId, setSelectedId] = React.useState(initialPromotions[0]?.id || "");
   const [draft, setDraft] = React.useState<Draft>(initialPromotions[0] ? toDraft(initialPromotions[0]) : emptyDraft);
   const [saving, setSaving] = React.useState(false);
   const [notice, setNotice] = React.useState("");
   const [query, setQuery] = React.useState("");
   const categories = React.useMemo(() => [...new Set(products.map((product) => product.category))].sort(), [products]);
   const filteredPromotions = promotions.filter((promotion) => `${promotion.name} ${promotion.description}`.toLowerCase().includes(query.toLowerCase()));
   const liveCount = promotions.filter((promotion) => promotionStatus(promotion).label === "Live").length;
   const totalRedemptions = promotions.reduce((total, promotion) => total + Number(promotion.redemptionCount || 0), 0);

   function editPromotion(promotion: Promotion) {
      setSelectedId(promotion.id);
      setDraft(toDraft(promotion));
      setNotice("");
   }

   function createPromotion() {
      setSelectedId("");
      setDraft(emptyDraft);
      setNotice("");
   }

   function update<K extends keyof Draft>(key: K, value: Draft[K]) {
      setDraft((current) => ({ ...current, [key]: value }));
   }

   function toggleList(key: "productIds" | "categories", value: string) {
      setDraft((current) => ({
         ...current,
         [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
      }));
   }

   async function savePromotion(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSaving(true);
      setNotice("");
      try {
         const response = await fetch("/api/commerce/promotions", {
            method: draft.id ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               ...draft,
               value: Number(draft.value),
               buyQuantity: Number(draft.buyQuantity),
               getQuantity: Number(draft.getQuantity),
               minimumSpend: Number(draft.minimumSpend),
               redemptionLimit: draft.redemptionLimit ? Number(draft.redemptionLimit) : null,
            }),
         });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Promotion could not be saved");
         const saved = data.promotion as Promotion;
         setPromotions((current) => current.some((promotion) => promotion.id === saved.id)
            ? current.map((promotion) => promotion.id === saved.id ? saved : promotion)
            : [saved, ...current]);
         setSelectedId(saved.id);
         setDraft(toDraft(saved));
         setNotice("Promotion saved. Eligible WhatsApp carts will now use these rules automatically.");
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Promotion could not be saved");
      } finally {
         setSaving(false);
      }
   }

   async function removePromotion() {
      if (!draft.id || !window.confirm(`Delete ${draft.name}? Existing orders will keep their saved discount record.`)) return;
      setSaving(true);
      setNotice("");
      try {
         const response = await fetch(`/api/commerce/promotions?id=${encodeURIComponent(draft.id)}`, { method: "DELETE" });
         const data = await response.json();
         if (!response.ok) throw new Error(data.error || "Promotion could not be deleted");
         const remaining = promotions.filter((promotion) => promotion.id !== draft.id);
         setPromotions(remaining);
         if (remaining[0]) editPromotion(remaining[0]);
         else createPromotion();
         setNotice("Promotion deleted. Existing payment and order records were not changed.");
      } catch (error) {
         setNotice(error instanceof Error ? error.message : "Promotion could not be deleted");
      } finally {
         setSaving(false);
      }
   }

   return (
      <div className="space-y-6">
         <section className="grid overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm sm:grid-cols-3">
            <div className="flex items-center gap-4 border-b border-zinc-100 p-5 sm:border-b-0 sm:border-r">
               <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Sparkles className="size-5" /></span>
               <div><strong className="block text-xl">{liveCount}</strong><span className="text-sm text-zinc-500">live offers</span></div>
            </div>
            <div className="flex items-center gap-4 border-b border-zinc-100 p-5 sm:border-b-0 sm:border-r">
               <span className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-700"><Layers3 className="size-5" /></span>
               <div><strong className="block text-xl">{promotions.length}</strong><span className="text-sm text-zinc-500">promotions created</span></div>
            </div>
            <div className="flex items-center gap-4 p-5">
               <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><UsersRound className="size-5" /></span>
               <div><strong className="block text-xl">{totalRedemptions}</strong><span className="text-sm text-zinc-500">confirmed redemptions</span></div>
            </div>
         </section>

         <section className="grid min-h-[720px] overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white shadow-[0_24px_70px_rgba(0,63,55,.08)] xl:grid-cols-[390px_minmax(0,1fr)]">
            <aside className="border-b border-zinc-200 bg-zinc-50/70 xl:border-b-0 xl:border-r">
               <div className="border-b border-zinc-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                     <div><h2 className="font-semibold text-zinc-950">Offer calendar</h2><p className="mt-1 text-sm text-zinc-500">Live, scheduled, and past campaigns.</p></div>
                     <Button type="button" size="icon" onClick={createPromotion} aria-label="Create promotion" className="rounded-xl"><Plus className="size-4" /></Button>
                  </div>
                  <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search promotions…" className="h-10 bg-white pl-9" /></div>
               </div>
               <div className="space-y-2 p-3">
                  {filteredPromotions.map((promotion) => {
                     const status = promotionStatus(promotion);
                     const StatusIcon = status.icon;
                     return (
                        <button key={promotion.id} type="button" onClick={() => editPromotion(promotion)} className={cn("w-full rounded-2xl border p-4 text-left transition", selectedId === promotion.id ? "border-emerald-300 bg-white shadow-sm" : "border-transparent hover:border-zinc-200 hover:bg-white")}>
                           <div className="flex items-start justify-between gap-3">
                              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", status.tone)}><StatusIcon className="size-3.5" />{status.label}</span>
                              <span className="text-xs font-semibold text-emerald-800">{offerLabel(promotion)}</span>
                           </div>
                           <strong className="mt-3 block text-sm text-zinc-950">{promotion.name}</strong>
                           <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{promotion.description}</p>
                           <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3 text-[11px] text-zinc-400"><span>{scopeLabel(promotion)}</span><span>{promotion.redemptionCount} used</span></div>
                        </button>
                     );
                  })}
                  {filteredPromotions.length === 0 ? <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 text-center text-sm leading-6 text-zinc-500">{promotions.length ? "No promotions match this search." : "No promotions yet. Create an offer when you are ready to drive sales."}</div> : null}
               </div>
            </aside>

            <div className="p-5 sm:p-8">
               <form onSubmit={savePromotion} className="mx-auto max-w-4xl space-y-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6">
                     <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{draft.id ? "Edit promotion" : "New promotion"}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{draft.id ? draft.name : "Build an offer customers understand"}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Only one promotion is applied per cart—the eligible offer that saves the customer the most.</p></div>
                     <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"><div><p className="text-sm font-semibold text-zinc-900">Available at checkout</p><p className="text-xs text-zinc-500">Pause without deleting</p></div><Switch checked={draft.active} onCheckedChange={(checked) => update("active", checked)} aria-label="Promotion active" /></div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                     <label className="space-y-2 text-sm font-semibold text-zinc-800 sm:col-span-2">Promotion name<Input required value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Weekend basket offer" className="h-11 rounded-xl" /></label>
                     <label className="space-y-2 text-sm font-semibold text-zinc-800 sm:col-span-2">Customer-facing details<Textarea required value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="e.g. Save 10% when your order is KES 1,000 or more this weekend." className="min-h-24 rounded-xl leading-6" /></label>
                  </div>

                  <section className="space-y-4">
                     <div><h3 className="font-semibold text-zinc-950">Offer mechanics</h3><p className="mt-1 text-sm text-zinc-500">These rules calculate the price. The AI cannot change them.</p></div>
                     <div className="grid gap-3 sm:grid-cols-3">
                        {([
                           ["percentage", "Percentage", BadgePercent],
                           ["fixed", "Fixed amount", CircleDollarSign],
                           ["buy_x_get_y", "Buy X, get Y", Gift],
                        ] as const).map(([value, label, Icon]) => (
                           <button key={value} type="button" onClick={() => update("type", value)} className={cn("flex items-center gap-3 rounded-2xl border p-4 text-left transition", draft.type === value ? "border-emerald-400 bg-emerald-50 text-emerald-950" : "border-zinc-200 hover:border-zinc-300")}><span className={cn("grid size-9 place-items-center rounded-xl", draft.type === value ? "bg-emerald-700 text-white" : "bg-zinc-100 text-zinc-500")}><Icon className="size-4" /></span><span className="text-sm font-semibold">{label}</span></button>
                        ))}
                     </div>
                     <div className="grid gap-4 sm:grid-cols-3">
                        {draft.type === "buy_x_get_y" ? <><label className="space-y-2 text-sm font-semibold text-zinc-800">Customer buys<Input required type="number" min="1" step="1" value={draft.buyQuantity} onChange={(event) => update("buyQuantity", event.target.value)} className="h-11 rounded-xl" /></label><label className="space-y-2 text-sm font-semibold text-zinc-800">Customer gets free<Input required type="number" min="1" step="1" value={draft.getQuantity} onChange={(event) => update("getQuantity", event.target.value)} className="h-11 rounded-xl" /></label></> : <label className="space-y-2 text-sm font-semibold text-zinc-800">{draft.type === "percentage" ? "Discount percentage" : "Discount amount (KES)"}<Input required type="number" min="1" max={draft.type === "percentage" ? "100" : undefined} step="1" value={draft.value} onChange={(event) => update("value", event.target.value)} className="h-11 rounded-xl" /></label>}
                        <label className="space-y-2 text-sm font-semibold text-zinc-800">Minimum cart spend (KES)<Input type="number" min="0" step="1" value={draft.minimumSpend} onChange={(event) => update("minimumSpend", event.target.value)} className="h-11 rounded-xl" /></label>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div><h3 className="font-semibold text-zinc-950">Eligible products</h3><p className="mt-1 text-sm text-zinc-500">Choose where the offer can create savings.</p></div>
                     <div className="grid gap-3 sm:grid-cols-3">{([['all', 'Entire catalog', 'Every available product'], ['products', 'Selected products', 'Choose exact catalog items'], ['categories', 'Categories', 'Include product groups']] as const).map(([value, label, description]) => <button key={value} type="button" onClick={() => update("scope", value)} className={cn("rounded-2xl border p-4 text-left", draft.scope === value ? "border-emerald-400 bg-emerald-50" : "border-zinc-200")}><span className="flex items-center justify-between gap-2"><strong className="text-sm text-zinc-950">{label}</strong>{draft.scope === value ? <Check className="size-4 text-emerald-700" /> : null}</span><span className="mt-1 block text-xs text-zinc-500">{description}</span></button>)}</div>
                     {draft.scope === "products" ? <div className="grid max-h-64 gap-2 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-2">{products.map((product) => <label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm"><input type="checkbox" checked={draft.productIds.includes(product.id)} onChange={() => toggleList("productIds", product.id)} className="size-4 accent-emerald-700" /><span className="min-w-0"><strong className="block truncate text-zinc-900">{product.name}</strong><span className="text-xs text-zinc-500">{product.category} · KES {product.price}</span></span></label>)}</div> : null}
                     {draft.scope === "categories" ? <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">{categories.map((category) => <button key={category} type="button" onClick={() => toggleList("categories", category)} className={cn("rounded-full border px-3 py-2 text-xs font-semibold", draft.categories.includes(category) ? "border-emerald-600 bg-emerald-700 text-white" : "border-zinc-200 bg-white text-zinc-700")}>{category}</button>)}</div> : null}
                  </section>

                  <section className="grid gap-4 sm:grid-cols-3">
                     <label className="space-y-2 text-sm font-semibold text-zinc-800">Starts<Input type="datetime-local" value={draft.startsAt} onChange={(event) => update("startsAt", event.target.value)} className="h-11 rounded-xl" /></label>
                     <label className="space-y-2 text-sm font-semibold text-zinc-800">Ends<Input type="datetime-local" value={draft.endsAt} onChange={(event) => update("endsAt", event.target.value)} className="h-11 rounded-xl" /></label>
                     <label className="space-y-2 text-sm font-semibold text-zinc-800">Redemption limit<Input type="number" min="1" step="1" value={draft.redemptionLimit} onChange={(event) => update("redemptionLimit", event.target.value)} placeholder="Unlimited" className="h-11 rounded-xl" /></label>
                  </section>

                  <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-[#eaf8ef]">
                     <div className="flex items-center gap-2 border-b border-emerald-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800"><PackageCheck className="size-4" />Customer preview</div>
                     <div className="p-5"><div className="max-w-xl rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-zinc-800 shadow-sm"><strong className="block text-emerald-800">{draft.name || "Your promotion"} — {offerLabel(draft)}</strong><span className="mt-1 block">{draft.description || "Add clear offer details customers can understand."}</span>{Number(draft.minimumSpend) > 0 ? <span className="mt-2 block text-xs text-zinc-500">Minimum order: KES {Number(draft.minimumSpend).toLocaleString("en-KE")}</span> : null}</div></div>
                  </section>

                  {notice ? <p role="status" aria-live="polite" className={cn("rounded-xl p-3 text-sm font-medium", notice.toLowerCase().includes("could not") || notice.toLowerCase().includes("required") || notice.toLowerCase().includes("choose") || notice.toLowerCase().includes("must") ? "border border-red-200 bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800")}>{notice}</p> : null}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-6">
                     <div>{draft.id ? <Button type="button" variant="outline" disabled={saving} onClick={removePromotion} className="border-red-200 text-red-700 hover:bg-red-50"><Trash2 className="mr-2 size-4" />Delete promotion</Button> : null}</div>
                     <Button type="submit" disabled={saving} className="h-11 rounded-xl bg-emerald-700 px-6 text-white hover:bg-emerald-800"><Save className="mr-2 size-4" />{saving ? "Saving…" : draft.id ? "Save changes" : "Create promotion"}</Button>
                  </div>
               </form>
            </div>
         </section>
      </div>
   );
}
