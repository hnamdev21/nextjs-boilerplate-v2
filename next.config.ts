import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Output optimization for better deployments
  output: 'standalone',

  // Environment variables
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  // Compression
  compress: true,

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Generate ETags for better caching
  generateEtags: true,

  // Optimization for static exports
  trailingSlash: false,

  // Server external packages (moved from experimental in Next.js 15)
  serverExternalPackages: ['sharp'],

  // Webpack optimizations
  webpack: (config, { dev }) => {
    // Optimization for production builds
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

  // Experimental optimizations (only stable features for Next.js 15)
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@chakra-ui/react', 'lodash'],
    scrollRestoration: true,
    // Server actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Headers for better performance and security
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
export default withNextIntl(nextConfig);
