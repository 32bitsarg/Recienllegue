import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserFavorites } from "@/app/actions/data";
import MobileFavoritos from "@/components/mobile/MobileFavoritos";
import DesktopFavoritos from "@/components/desktop/DesktopFavoritos";

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);
    const favorites = session?.user ? await getUserFavorites((session.user as any).id) : null;
    const initialData = favorites ? { favorites } : null;

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileFavoritos initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopFavoritos initialData={initialData} />
            </div>
        </main>
    );
}
