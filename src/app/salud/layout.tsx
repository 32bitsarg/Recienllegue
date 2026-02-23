import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Salud y Urgencias en Pergamino | Recién Llegué",
    description: "Números de emergencia, hospitales, centros de salud (CAPS) y farmacias de turno en Pergamino. Información esencial para estudiantes.",
    keywords: ["Salud Pergamino", "Urgencias Pergamino", "Hospital Pergamino", "CAPS Pergamino", "Farmacias de Turno"],
};

export default function SaludLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
