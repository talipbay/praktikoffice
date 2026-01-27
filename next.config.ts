import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Remove output: "export" for now to support middleware and dynamic routes
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapi.io',
        pathname: '/uploads/**',
      },
    ],
  },
  ...(isProd &&
    isGitHubPages && {
      basePath: "/praktikoffice",
      assetPrefix: "/praktikoffice",
    }),
};

export default withNextIntl(nextConfig);
