import { getCityEvents } from "@/app/actions/data";
import MobileEventos from "@/components/mobile/MobileEventos";
import DesktopEventos from "@/components/desktop/DesktopEventos";

export default async function EventosPage() {
    // Pre-fetch events on the server for instant loading
    const events = await getCityEvents();

    return (
        <main className="safe-bottom">
            {/* Mobile version remains inside its client component */}
            <div className="mobile-only">
                <MobileEventos initialEvents={events} />
            </div>

            {/* Desktop version receives pre-fetched data */}
            <div className="desktop-only">
                <DesktopEventos initialEvents={events} />
            </div>
        </main>
    );
}
