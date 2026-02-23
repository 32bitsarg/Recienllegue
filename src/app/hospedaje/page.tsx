import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProperties, getUserFavorites } from "@/app/actions/data";
import MobileHospedaje from "@/components/mobile/MobileHospedaje";
import DesktopHospedaje from "@/components/desktop/DesktopHospedaje";

export default async function HospedajePage() {
    const session = await getServerSession(authOptions);

    const [properties, favorites] = await Promise.all([
        getProperties(),
        session?.user ? getUserFavorites((session.user as any).id) : Promise.resolve({ properties: [], restaurants: [] })
    ]);

    const initialData = {
        properties,
        savedIds: favorites.properties.map((p: any) => p.id)
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileHospedaje initialData={initialData} />
            </div>

            <div className="desktop-only">
                <DesktopHospedaje initialData={initialData} />
            </div>
        </main>
    );
}
