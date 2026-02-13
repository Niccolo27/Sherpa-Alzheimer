import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Abbiamo rimosso i18n da qui perché causava il conflitto
};

export default nextConfig;