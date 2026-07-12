import { NextRequest, NextResponse } from "next/server";
import {
   getSettingsForDashboard,
   saveRuntimeSettings,
   testRuntimeProvider,
} from "@/src/settings-store";

export const dynamic = "force-dynamic";

export async function GET() {
   try {
      return NextResponse.json({ settings: await getSettingsForDashboard() });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Settings could not be loaded" },
         { status: 500 },
      );
   }
}

export async function PUT(request: NextRequest) {
   try {
      const body = await request.json();
      const settings = await saveRuntimeSettings(body, "dashboard administrator");
      return NextResponse.json({ settings });
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Settings could not be saved" },
         { status: 400 },
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const provider = String(body.provider || "");
      const credentials = body.credentials || {};
      const overrides: Record<string, string> = {};

      if (provider === "groq" && credentials.apiKey) {
         overrides.groqApiKey = String(credentials.apiKey).trim();
      }
      if (provider === "mpesa") {
         if (credentials.consumerKey) overrides.mpesaConsumerKey = String(credentials.consumerKey).trim();
         if (credentials.consumerSecret) overrides.mpesaConsumerSecret = String(credentials.consumerSecret).trim();
         if (credentials.environment) overrides.mpesaEnvironment = String(credentials.environment).trim();
      }

      return NextResponse.json(await testRuntimeProvider(provider, overrides));
   } catch (error) {
      return NextResponse.json(
         { error: error instanceof Error ? error.message : "Connection test failed" },
         { status: 400 },
      );
   }
}
