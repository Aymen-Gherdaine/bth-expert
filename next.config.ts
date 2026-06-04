import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root inference (multiple lockfiles detected upstream)
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;