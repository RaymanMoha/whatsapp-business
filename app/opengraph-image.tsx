import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "AppBase — WhatsApp commerce and M-Pesa payments for Kenyan businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
   const logo = await readFile(join(process.cwd(), "public/appbase-logo-green.png"), "base64");

   return new ImageResponse(
      (
         <div
            style={{
               width: "100%",
               height: "100%",
               display: "flex",
               flexDirection: "column",
               justifyContent: "space-between",
               background: "#f6f4ed",
               color: "#07120d",
               padding: "64px 72px 56px",
               fontFamily: "Arial, sans-serif",
            }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
               <img
                  src={"data:image/png;base64," + logo}
                  width="150"
                  height="92"
                  style={{ objectFit: "contain" }}
                  alt=""
               />
               <div
                  style={{
                     display: "flex",
                     border: "1px solid rgba(7,18,13,.15)",
                     borderRadius: 999,
                     padding: "10px 18px",
                     fontSize: 18,
                     fontWeight: 700,
                  }}>
                  Built for Kenya
               </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: 920 }}>
               <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-4px" }}>
                  Turn WhatsApp chats into
               </div>
               <div
                  style={{
                     display: "flex",
                     alignSelf: "flex-start",
                     background: "#9dff2f",
                     padding: "0 12px 6px",
                     fontSize: 80,
                     fontWeight: 700,
                     lineHeight: 1,
                  }}>
                  paid orders.
               </div>
            </div>

            <div
               style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid rgba(7,18,13,.14)",
                  paddingTop: 26,
               }}>
               <div style={{ display: "flex", gap: 18, fontSize: 21, color: "#355047" }}>
                  <span>Catalogues</span><span>·</span><span>Approved replies</span><span>·</span><span>M-Pesa</span><span>·</span><span>Receipts</span>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 700, color: "#08742e" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: "#9dff2f" }} />
                  appbase
               </div>
            </div>
         </div>
      ),
      size,
   );
}
