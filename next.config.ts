import type { NextConfig } from "next";

<<<<<<< HEAD
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' blob: https://clerk.af-gear.com https://*.clerk.accounts.dev https://challenges.cloudflare.com https://js.stripe.com;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://clerk.af-gear.com https://images.clerk.dev https://*.supabase.co https://img.clerk.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://clerk.af-gear.com https://clerk-telemetry.com https://*.clerk.accounts.dev https://*.supabase.co https://api.stripe.com;
  frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
=======
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
>>>>>>> target/main
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
<<<<<<< HEAD
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      }
=======
>>>>>>> target/main
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
<<<<<<< HEAD
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          {
=======
>>>>>>> target/main
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
<<<<<<< HEAD
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
=======
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
>>>>>>> target/main
          },
        ],
      },
    ];
  },
};

export default nextConfig;
