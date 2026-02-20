import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "El Estudiante - La Guía de Pergamino",
    template: "%s | El Estudiante",
  },
  description: "La plataforma definitiva para estudiantes en Pergamino. Encontrá hospedaje, comida, servicios de salud e info de la UNNOBA en un solo lugar.",
  keywords: ["Pergamino", "UNNOBA", "Estudiantes", "Hospedaje", "Residencias", "Guía Universitaria"],
  authors: [{ name: "El Estudiante Team" }],
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "El Estudiante",
    title: "El Estudiante - La Guía de Pergamino",
    description: "Tu guía de supervivencia universitaria en Pergamino. Hospedaje, comida, transporte, salud y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "El Estudiante - La Guía de Pergamino",
    description: "Tu guía de supervivencia universitaria en Pergamino.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "El Estudiante",
  },
  icons: {
    icon: "/assets/icons/Iconrmbg.png",
    apple: "/assets/icons/icon.jpg",
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
