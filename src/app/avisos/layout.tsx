import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tablón de Avisos | Recién Llegué",
    description: "Conectá con otros estudiantes en Pergamino. Publicá y encontrá avisos de vivienda, libros, eventos y más.",
    keywords: ["Avisos Pergamino", "Comunidad UNNOBA", "Tablón Estudiantes", "Vivienda Pergamino"],
};

export default function AvisosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
