import { getNotices } from "@/app/actions/data";
import MobileAvisos from "@/components/mobile/MobileAvisos";
import DesktopAvisos from "@/components/desktop/DesktopAvisos";

export default async function AvisosPage() {
    const notices = await getNotices();

    const initialData = {
        notices
    };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileAvisos initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopAvisos initialData={initialData} />
            </div>
        </main>
    );
}
