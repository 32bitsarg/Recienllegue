import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Recién Llegué - La Guía de Pergamino",
    template: "%s | Recién Llegué",
  },
  description: "La plataforma definitiva para quienes llegan a Pergamino. Encontrá hospedaje, comida, servicios de salud e info de la UNNOBA en un solo lugar.",
  keywords: ["Pergamino", "UNNOBA", "Estudiantes", "Hospedaje", "Residencias", "Guía Universitaria"],
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
    title: "Recién Llegué - La Guía de Pergamino",
    description: "Tu guía de supervivencia en Pergamino. Hospedaje, comida, transporte, salud y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recién Llegué - La Guía de Pergamino",
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
      { url: "/favicon.ico" }
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
    <html lang="es">
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
