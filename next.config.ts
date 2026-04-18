import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // ── App pages (NetworkFirst) ─────────────────────────
      {
        urlPattern: /^https?:\/\/.*\/app\/.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "app-pages",
          networkTimeoutSeconds: 5,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
        },
      },
      // ── Matecitodb API — datos (NetworkFirst) ────────────
      {
        urlPattern: /\/api\/project\/.*\/records/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-records",
          networkTimeoutSeconds: 3,
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 6 },
        },
      },
      // ── Next.js static assets (CacheFirst) ───────────────
      {
        urlPattern: /\/_next\/static\/.*/,
        handler: "CacheFirst",
        options: {
          cacheName: "next-static",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // ── Imágenes (CacheFirst) ─────────────────────────────
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      // ── DiceBear avatars (CacheFirst) ────────────────────
      {
        urlPattern: /api\.dicebear\.com/,
        handler: "CacheFirst",
        options: {
          cacheName: "avatars",
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      // ── Tiles del mapa (CacheFirst) ──────────────────────
      {
        urlPattern: /basemaps\.cartocdn\.com/,
        handler: "CacheFirst",
        options: {
          cacheName: "map-tiles",
          expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
    ],
  },
});

const CSP = [
  "default-src 'self'",
  // Scripts propios + Next.js inline + Google Tag Manager / Analytics
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
  // Estilos propios + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com",
  // Fuentes — Google Fonts
  "font-src 'self' https://fonts.gstatic.com data:",
  // Imágenes — permisivo para contenido generado por usuarios + GA pixel
  "img-src 'self' data: blob: https: http:",
  // Conexiones — GA, GTM, DoubleClick, APIs internas
  "connect-src 'self' http://localhost:3001 ws://localhost:3001 https://recienllegue.matecito.dev wss://recienllegue.matecito.dev https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://region1.google-analytics.com https://region1.analytics.google.com https://www.googletagmanager.com https://tagmanager.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com",
  // iframes — GTM preview
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://bid.g.doubleclick.net",
  // Workers del service worker (PWA)
  "worker-src 'self' blob:",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [
      {
        source: "/api/matecito/:path*",
        destination: "https://recienllegue.matecito.dev/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",         value: "SAMEORIGIN" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
