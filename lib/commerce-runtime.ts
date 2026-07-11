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
   const wahaBaseUrl = process.env.WAHA_BASE_URL || "http://localhost:3001";
   const wahaApiKey = process.env.WAHA_API_KEY || "";
   const sessionName = process.env.WAHA_SESSION || "default";
   const botBaseUrl = process.env.BOT_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;

   const [bot, waha, mongo] = await Promise.allSettled([
      fetch(`${botBaseUrl}/health`, { cache: "no-store" }).then((response) =>
         response.ok ? response.json() : null,
      ),
      fetch(`${wahaBaseUrl}/api/sessions?all=true`, {
         cache: "no-store",
         headers: wahaApiKey ? { "X-Api-Key": wahaApiKey } : {},
      }).then((response) => (response.ok ? response.json() : [])),
      getMongoStatus(),
   ]);

   const botHealth = bot.status === "fulfilled" ? bot.value : null;
   const sessions = (waha.status === "fulfilled" && Array.isArray(waha.value)
      ? waha.value
      : []) as WahaSession[];
   const session = sessions.find((item) => item.name === sessionName) || sessions[0];

   return {
      bot: {
         configured: Boolean(botHealth?.groqConfigured),
         online: Boolean(botHealth?.ok),
         businessName: botHealth?.businessName || process.env.BUSINESS_NAME || "WhatsApp Store",
      },
      waha: {
         online: Boolean(session),
         session: session?.name || sessionName,
         status: session?.status || "NOT_CONNECTED",
         phone: session?.me?.id || null,
         pushName: session?.me?.pushName || null,
      },
      groq: {
         configured: Boolean(process.env.GROQ_API_KEY),
         model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      },
      mongo:
         mongo.status === "fulfilled"
            ? mongo.value
            : {
                 configured: Boolean(process.env.MONGODB_URI),
                 connected: false,
                 database: process.env.MONGODB_DB || "whatsapp_business",
              },
   };
}
