import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getUserNotices } from "@/app/actions/data";
import MobileMisAvisos from "@/components/mobile/MobileMisAvisos";
import DesktopMisAvisos from "@/components/desktop/DesktopMisAvisos";

export default async function MyNoticesPage() {
    const session = await getServerSession(authOptions);
    const notices = session?.user ? await getUserNotices((session.user as any).id) : [];
    const initialData = { notices };

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileMisAvisos initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopMisAvisos initialData={initialData} />
            </div>
        </main>
    );
}
