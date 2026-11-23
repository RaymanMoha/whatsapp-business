import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
   return {
      name: "AppBase — WhatsApp Commerce Kenya",
      short_name: "AppBase",
      description: "WhatsApp commerce, M-Pesa checkout and order management for Kenyan businesses.",
      start_url: "/",
      display: "standalone",
      background_color: "#f6f4ed",
      theme_color: "#07120d",
      icons: [
         { src: "/icon.png", sizes: "512x512", type: "image/png" },
         { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
   };
}
