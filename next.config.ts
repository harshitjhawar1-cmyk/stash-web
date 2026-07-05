import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/stashweb',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
