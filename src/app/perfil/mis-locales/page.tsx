import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import MisPanelLocales from "@/components/perfil/MisPanelLocales";

export const metadata = {
    title: "Mis Locales | Recién Llegué",
    description: "Gestioná tus locales y revisá el estado de verificación."
};

export default async function MisLocalesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) redirect('/unirse/login');
    if ((session.user as any).role === 'ESTUDIANTE') redirect('/perfil');

    return <MisPanelLocales userId={(session.user as any).id} />;
}
