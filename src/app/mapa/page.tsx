import { getUniversitySedes, getHealthServices } from "@/app/actions/data";
import type { MapPOI } from "@/components/map/SurvivalMap";
import MobileMapa from "@/components/mobile/MobileMapa";
import DesktopMapa from "@/components/desktop/DesktopMapa";

async function buildMapPOIs(): Promise<MapPOI[]> {
    const [sedes, health] = await Promise.all([
        getUniversitySedes(),
        getHealthServices()
    ]);
    const mapPois: MapPOI[] = [];

    sedes.forEach((sede: any) => {
        if (sede.lat && sede.lng && sede.lat !== "0" && sede.lng !== "0") {
            mapPois.push({
                id: sede.id,
                name: sede.name,
                description: sede.address + (sede.phone ? ` | Tel: ${sede.phone}` : ''),
                position: [parseFloat(sede.lat), parseFloat(sede.lng)],
                category: 'university'
            });
        }
    });

    health.forEach((h: any) => {
        if (h.lat && h.lng && h.lat !== "0" && h.lng !== "0") {
            mapPois.push({
                id: h.id,
                name: h.name,
                description: (h.address || '') + (h.number ? ` | Tel: ${h.number}` : ''),
                position: [parseFloat(h.lat), parseFloat(h.lng)],
                category: 'health'
            });
        }
    });

    return mapPois;
}

export default async function MapPage() {
    const pois = await buildMapPOIs();
    const initialData = { pois };

    return (
        <main className="safe-bottom" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="mobile-only">
                <MobileMapa initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopMapa initialData={initialData} />
            </div>
        </main>
    );
}
