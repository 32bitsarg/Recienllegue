import { getPropertyById } from "@/app/actions/data";
import MobilePropertyDetail from "@/components/mobile/MobilePropertyDetail";
import DesktopPropertyDetail from "@/components/desktop/DesktopPropertyDetail";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
    const { id } = await params;
    const property = await getPropertyById(id);

    const initialData = property ? { property } : null;

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobilePropertyDetail initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopPropertyDetail initialData={initialData} />
            </div>
        </main>
    );
}
