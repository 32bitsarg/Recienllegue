import { getUniversitySedes, getUniversityServices } from "@/app/actions/data";
import MobileUNNOBA from "@/components/mobile/MobileUNNOBA";
import DesktopUNNOBA from "@/components/desktop/DesktopUNNOBA";

export default async function UNNOBAPage() {
    const [sedes, services] = await Promise.all([
        getUniversitySedes(),
        getUniversityServices()
    ]);

    const initialData = {
        sedes,
        services
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileUNNOBA initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopUNNOBA initialData={initialData} />
            </div>
        </main>
    );
}
