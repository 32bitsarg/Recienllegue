import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transporte en Pergamino | Recién Llegué",
    description: "Horarios de colectivos urbanos, rutas de terminal y seguimiento en vivo. Toda la info de transporte para moverte por Pergamino.",
    keywords: ["Transporte Pergamino", "Colectivos Pergamino", "Terminal Pergamino", "Horarios Bus Pergamino"],
};

export default function TransporteLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
