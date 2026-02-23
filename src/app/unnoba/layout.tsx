import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "UNNOBA Pergamino | Recién Llegué",
    description: "Sedes, servicios al estudiante, trámites y contactos de la UNNOBA en Pergamino. Tu guía académica completa.",
    keywords: ["UNNOBA Pergamino", "Sede UNNOBA", "Servicios UNNOBA", "SIU Guaraní UNNOBA", "Universidad Pergamino"],
};

export default function UNNOBALayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
