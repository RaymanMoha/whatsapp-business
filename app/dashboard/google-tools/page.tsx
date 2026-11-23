import { headers } from "next/headers";
import { GoogleTools, type GoogleToolsSettings } from "@/components/commerce/google-tools";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import Heading from "@/components/heading";
import { getSettingsForDashboard } from "@/src/settings-store";

export const dynamic = "force-dynamic";

export default async function GoogleToolsPage() {
   const [settings, requestHeaders] = await Promise.all([getSettingsForDashboard(), headers()]);
   const values = settings.values as Record<string, string>;
   const secrets = settings.secrets as Record<string, { configured: boolean; ending: string | null; source: string }>;
   const googleSettings: GoogleToolsSettings = {
      values: {
         googleSpreadsheetUrl: values.googleSpreadsheetUrl || "",
         googleAppsScriptUrl: values.googleAppsScriptUrl || "",
      },
      secrets: {
         googleIntegrationSecret: secrets.googleIntegrationSecret || { configured: false, ending: null, source: "missing" },
      },
      updatedAt: settings.updatedAt,
   };
   const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3002";
   const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");

   return (
      <DashboardLayout>
         <div className="relative z-10 min-w-0 space-y-6">
            <div className="pl-9 sm:pl-0">
               <Heading title="Google Tools" description="Connect Sheets and Forms without replacing your commerce database." />
            </div>
            <GoogleTools initialSettings={googleSettings} appUrl={`${protocol}://${host}`} />
         </div>
      </DashboardLayout>
   );
}
