type WahaSession = {
   name?: string;
   status?: string;
   me?: {
      id?: string;
      pushName?: string;
   };
};

export async function getCommerceRuntimeStatus() {
   const { getMongoStatus } = await import("@/src/mongodb");
   const { readProducts } = await import("@/src/product-store");
   const { getMpesaStatus } = await import("@/src/mpesa-store");
   const { getRuntimeSettings } = await import("@/src/settings-store");
   const runtime = await getRuntimeSettings();
   const wahaBaseUrl = runtime.wahaBaseUrl;
   const wahaApiKey = runtime.wahaApiKey;
   const sessionName = runtime.wahaSession;
   const botBaseUrl = process.env.BOT_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

   const [bot, waha, mongo, products, mpesa] = await Promise.allSettled([
      fetch(`${botBaseUrl}/health`, { cache: "no-store" }).then((response) =>
         response.ok ? response.json() : null,
      ),
      fetch(`${wahaBaseUrl}/api/sessions?all=true`, {
         cache: "no-store",
         headers: wahaApiKey ? { "X-Api-Key": wahaApiKey } : {},
      }).then((response) => (response.ok ? response.json() : [])),
      getMongoStatus(),
      readProducts(),
      getMpesaStatus(),
   ]);

   const botHealth = bot.status === "fulfilled" ? bot.value : null;
   const sessions = (waha.status === "fulfilled" && Array.isArray(waha.value)
      ? waha.value
      : []) as WahaSession[];
   const session = sessions.find((item) => item.name === sessionName) || sessions[0];
   const productList = products.status === "fulfilled" && Array.isArray(products.value) ? products.value : [];
   const imageCount = productList.filter((product) => Boolean(product.image?.data)).length;

   return {
      bot: {
         configured: Boolean(botHealth?.aiConfigured),
         online: Boolean(botHealth?.ok),
         businessName: botHealth?.businessName || runtime.businessName,
      },
      messaging: {
         online: Boolean(session),
         session: session?.name || sessionName,
         status: session?.status || "NOT_CONNECTED",
         phone: session?.me?.id || null,
         pushName: session?.me?.pushName || null,
      },
      ai: {
         configured: Boolean(runtime.groqApiKey),
         model: runtime.groqModel,
      },
      mongo:
         mongo.status === "fulfilled"
            ? mongo.value
            : {
                 configured: Boolean(process.env.MONGODB_URI),
                 connected: false,
                 database: process.env.MONGODB_DB || "whatsapp_business",
              },
      products: {
         total: productList.length,
         withImages: imageCount,
         withoutImages: Math.max(productList.length - imageCount, 0),
      },
      mpesa:
         mpesa.status === "fulfilled"
            ? mpesa.value
            : {
                 configured: false,
                 missing: ["M-Pesa settings unavailable"],
                 environment: "unknown",
                 shortCode: null,
                 partyA: null,
                 callbackUrl: null,
              },
   };
}
