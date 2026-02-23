import MobileBuscar from "@/components/mobile/MobileBuscar";
import DesktopBuscar from "@/components/desktop/DesktopBuscar";

export default function BuscarPage() {
    return (
        <main className="safe-bottom" style={{ background: 'var(--background)', minHeight: '100vh' }}>
            <div className="mobile-only">
                <MobileBuscar />
            </div>
            <div className="desktop-only">
                <DesktopBuscar />
            </div>
        </main>
    );
}
