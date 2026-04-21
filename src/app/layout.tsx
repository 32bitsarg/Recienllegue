import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const GA_ID  = "G-VCTWHCEV8H";
const AW_ID  = "AW-18014513807";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-head",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const BASE_URL = 'https://recienlleguee.com.ar'

export const metadata: Metadata = {
  title: "Recién Llegué | Tu guía para instalarte en Pergamino",
  description:
    "Guía para estudiantes universitarios en Pergamino. Alojamiento, transporte, comercios y comunidad estudiantil para comparar antes de llegar.",
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Recién Llegué | Tu guía para instalarte en Pergamino",
    description: "Guía para estudiantes universitarios en Pergamino. Alojamiento, transporte, comercios y comunidad estudiantil.",
    url: BASE_URL,
    siteName: 'Recién Llegué',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Recién Llegué | Tu guía para instalarte en Pergamino",
    description: "Guía completa para estudiantes universitarios en Pergamino.",
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: { url: '/icons/favicon-192.png', sizes: '192x192', type: 'image/png' },
    shortcut: '/icons/favicon-32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen antialiased`}
        style={{ background: "#F1F5F9", color: "#0F172A" }}
      >
        {children}
        <CookieBanner />

        {/* Google Analytics con consent mode */}
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Denegar por defecto hasta que el usuario acepte
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
            });
            // Si ya aceptó en sesión anterior, restaurar
            try {
              var consent = localStorage.getItem('rl_cookie_consent');
              if (consent === 'all') {
                gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
              }
            } catch(e) {}
          `}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
            gtag('config', '${AW_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
