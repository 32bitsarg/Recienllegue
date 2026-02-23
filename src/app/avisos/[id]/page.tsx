import { getNoticeById } from "@/app/actions/data";
import MobileDetalleAviso from "@/components/mobile/MobileDetalleAviso";
import DesktopDetalleAviso from "@/components/desktop/DesktopDetalleAviso";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DetalleAvisoPage({ params }: PageProps) {
    const { id } = await params;
    const notice = await getNoticeById(id);
    const initialData = notice ? { notice } : null;

    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileDetalleAviso initialData={initialData} />
            </div>
            <div className="desktop-only">
                <DesktopDetalleAviso initialData={initialData} />
            </div>
        </main>
    );
}
