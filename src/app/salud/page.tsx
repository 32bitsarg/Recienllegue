import { getHealthServices, getOndutyPharmacies } from "@/app/actions/data";
import MobileSalud from "@/components/mobile/MobileSalud";
import DesktopSalud from "@/components/desktop/DesktopSalud";

export default async function SaludPage() {
    const [healthServices, pharms] = await Promise.all([
        getHealthServices(),
        getOndutyPharmacies()
    ]);

    const pharmacies = pharms?.pharmacies ?? [];
    const pharmaciesDate = pharms?.date ?? "";

    const initialData = {
        healthServices,
        pharmacies,
        pharmaciesDate
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileSalud initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopSalud initialData={initialData} />
            </div>
        </main>
    );
}
