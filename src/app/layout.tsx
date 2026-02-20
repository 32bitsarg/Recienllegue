import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Recién Llegué",
    template: "%s | Recién Llegué",
  },
  description: "Tu guía en Pergamino. Encontrá hospedaje, comida, remises y servicios en un solo lugar.",
  keywords: ["Pergamino", "Recién Llegué", "Hospedaje", "Remises", "Guía"],
  authors: [{ name: "Recién Llegué Team" }],
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Recién Llegué",
    title: "Recién Llegué",
    description: "Tu guía de supervivencia en Pergamino. Hospedaje, comida, transporte, salud y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recién Llegué",
    description: "Tu guía de supervivencia en Pergamino.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Recién Llegué",
  },
  icons: {
    icon: [
      { url: "/assets/icons/Iconrmbg.png" },
    ],
    shortcut: "/assets/icons/Iconrmbg.png",
    apple: "/assets/icons/Iconrmbg.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import PageTransition from "@/components/layout/PageTransition";
import BottomNav from "@/components/layout/BottomNav";
import LoadingScreen from "@/components/common/LoadingScreen";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="apple-touch-icon" href="/assets/icons/Iconrmbg.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable}`}>
        <AuthProvider>
          <LoadingScreen />
          <div className="mobile-container">
            <PageTransition>
              {children}
            </PageTransition>
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
