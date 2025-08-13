import withPWAInit from '@ducanh2912/next-pwa';
import { NextConfig } from 'next';
import createBundleAnalyzerPlugin from '@next/bundle-analyzer';
import createIntlPlugin from 'next-intl/plugin';
import withPlugins from 'next-compose-plugins';
import withSvgr from 'next-plugin-svgr';

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

const withBundleAnalyzer = createBundleAnalyzerPlugin({
  enabled: process.env.NEXT_PUBLIC_ANALYZE === 'true',
});
const withNextIntl = createIntlPlugin();
const withPwa = withPWAInit({
  dest: 'public',
  disable: !isProduction,
  register: !isProduction,
  workboxOptions: {
    disableDevLogs: true,
    cleanupOutdatedCaches: true,
  },
});

const nextConfig: NextConfig = {
  output: 'standalone',

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
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'test-streams.mux.dev',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
    ],
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
    optimizePackageImports: ['@chakra-ui/react', 'lodash', '@emotion/react', '@emotion/styled'],
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    gzipSize: true,
    optimizeServerReact: true,
    serverMinification: true,
    optimizeCss: true,
    cssChunking: true,
    webpackMemoryOptimizations: true,
  },
  compiler: {
    removeConsole: isProduction,
    styledComponents: true,
    styledJsx: true,
    reactRemoveProperties: true,
    emotion: true,
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

export default withPlugins([withBundleAnalyzer, withNextIntl, withPwa, withSvgr], nextConfig);
