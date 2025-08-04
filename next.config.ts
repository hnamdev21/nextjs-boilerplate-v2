import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },

  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  trailingSlash: false,
  serverExternalPackages: ['sharp'],

  sassOptions: {
    additionalData: `@use "@/styles/tool.scss" as *;`,
  },

  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        sideEffects: false,
      };
    }

    // Bundle analyzer (optional, uncomment to enable)
    // if (!isServer) {
    //   config.resolve.fallback = {
    //     ...config.resolve.fallback,
    //     fs: false,
    //   };
    // }

    return config;
  },

  experimental: {
    optimizePackageImports: ['@chakra-ui/react', 'lodash'],
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default async () => {
  if (isProduction) {
    const { default: withPWA } = await import('@ducanh2912/next-pwa');

    return withPWA({
      dest: 'public',
      workboxOptions: {
        disableDevLogs: true,
      },
    })(nextConfig);
  }

  return withNextIntl(nextConfig);
};
