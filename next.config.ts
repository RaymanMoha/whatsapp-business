import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["exceljs"],
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
