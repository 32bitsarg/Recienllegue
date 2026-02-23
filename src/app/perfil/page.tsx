import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserStats } from "@/app/actions/data";
import MobilePerfil from "@/components/mobile/MobilePerfil";
import DesktopPerfil from "@/components/desktop/DesktopPerfil";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const stats = session?.user ? await getUserStats((session.user as any).id) : null;
    const initialData = stats ? { stats } : null;

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobilePerfil initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopPerfil initialData={initialData} />
            </div>
        </main>
    );
}
