import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hospedaje en Pergamino | Recién Llegué",
    description: "Encontrá residencias, departamentos y habitaciones para estudiantes en Pergamino. Precios, servicios, fotos y contacto directo con dueños.",
    keywords: ["Hospedaje Pergamino", "Residencias Pergamino", "Departamentos UNNOBA", "Alojamiento Estudiantes"],
};

export default function HospedajeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
