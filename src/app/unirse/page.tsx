import MobileUnirse from "@/components/mobile/MobileUnirse";
import DesktopUnirse from "@/components/desktop/DesktopUnirse";

export default function UnirsePage() {
    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileUnirse />
            </div>
            <div className="desktop-only">
                <DesktopUnirse />
            </div>
        </main>
    );
}
