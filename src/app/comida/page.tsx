import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getRestaurants, getUserFavorites } from "@/app/actions/data";
import MobileComida from "@/components/mobile/MobileComida";
import DesktopComida from "@/components/desktop/DesktopComida";

export default async function ComidaPage() {
    const session = await getServerSession(authOptions);

    const [restaurants, favorites] = await Promise.all([
        getRestaurants(),
        session?.user ? getUserFavorites((session.user as any).id) : Promise.resolve({ properties: [], restaurants: [] })
    ]);

    const initialData = {
        restaurants,
        savedIds: favorites.restaurants.map((r: any) => r.id)
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileComida initialData={initialData} />
            </div>

            <div className="desktop-only">
                <DesktopComida initialData={initialData} />
            </div>
        </main>
    );
}
