import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const GA_ID  = "G-VCTWHCEV8H";
const AW_ID  = "AW-18014513807";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Recien Llegue | Tu guia para llegar y quedarte",
  description:
    "Portal de recursos para estudiantes universitarios en Argentina. Alojamiento, transporte y servicios locales verificados.",
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
        className={`${dmSans.variable} ${dmSans.className} min-h-screen antialiased`}
        style={{
          background: "#f8faf8",
          color: "#051f20",
        }}
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
