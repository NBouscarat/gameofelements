import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output:"export",
  basePath: '/goe',
  images: { unoptimized: true },
};

export default nextConfig;
