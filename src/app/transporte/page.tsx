import { getTransportLines, getTerminalRoutes } from "@/app/actions/data";
import MobileTransporte from "@/components/mobile/MobileTransporte";
import DesktopTransporte from "@/components/desktop/DesktopTransporte";

export default async function TransportePage() {
    const [urbanLines, terminalRoutes] = await Promise.all([
        getTransportLines(),
        getTerminalRoutes()
    ]);

    const initialData = {
        urbanLines,
        terminalRoutes
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileTransporte initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopTransporte initialData={initialData} />
            </div>
        </main>
    );
}
