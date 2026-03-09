import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:filename*',
        destination: '/api/uploads/:filename*',
      },
    ];
  },
};

export default nextConfig;
