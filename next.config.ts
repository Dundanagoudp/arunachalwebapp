import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), payment=(), clipboard-read=(), clipboard-write=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(self), gyroscope=(), magnetometer=(), midi=(), picture-in-picture=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // COEP can break external resources; leave unset unless you operate in a COOP/COEP isolated environment
          // { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: isDev ? "on" : "off" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "form-action 'self'",
              "upgrade-insecure-requests",
              // Scripts: keep 'unsafe-inline'/'unsafe-eval' for now to avoid breakage; replace with nonces/hashes later
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.googletagmanager.com https://www.google-analytics.com",
              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Images (self, data/blob, configured remote domains)
              "img-src 'self' data: blob: https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://storage.googleapis.com https://img.youtube.com",
              // Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Connections (APIs, analytics, vercel vitals, GCS)
              "connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-insights.com https://www.google-analytics.com https://storage.googleapis.com",
              // Frames (YouTube embeds)
              "frame-src 'self' https://www.youtube.com",
              // Prevent clickjacking in addition to X-Frame-Options
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      'images.unsplash.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'storage.googleapis.com',
      'img.youtube.com',
    ],
  },
};

export default nextConfig;
