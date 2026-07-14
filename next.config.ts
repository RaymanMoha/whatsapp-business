import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["exceljs"],
  async headers() {
    return [
      {
        source: "/google-commerce-sync.gs",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Content-Disposition", value: "inline; filename=Code.gs" },
        ],
      },
    ]
  },
  // Silence workspace root inference warning by pinning the root
  turbopack: {
    root: process.cwd(),
  },
  eslint: {
    // Disable ESLint during builds (warnings will still show in development)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
