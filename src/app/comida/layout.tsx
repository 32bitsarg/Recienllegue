import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Comida y Ocio en Pergamino | El Estudiante",
    description: "Descubrí los mejores lugares para comer en Pergamino: rotiserías, bares, cafeterías y restaurantes cerca de la UNNOBA.",
    keywords: ["Comida Pergamino", "Restaurantes UNNOBA", "Dónde comer Pergamino", "Bares Pergamino"],
};

export default function ComidaLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
