import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: "/praktikoffice",
  assetPrefix: "/praktikoffice",
};

export default nextConfig;
