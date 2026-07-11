import { NextResponse } from "next/server";
import { listConversationSummaries, readConversationThreads } from "@/src/message-store";

export async function GET() {
   return NextResponse.json({
      conversations: await listConversationSummaries(),
      threads: await readConversationThreads(),
   });
}
