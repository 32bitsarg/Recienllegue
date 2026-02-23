import MobileEditarPerfil from "@/components/mobile/MobileEditarPerfil";
import DesktopEditarPerfil from "@/components/desktop/DesktopEditarPerfil";

export default function EditProfilePage() {
    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileEditarPerfil />
            </div>
            <div className="desktop-only">
                <DesktopEditarPerfil />
            </div>
        </main>
    );
}
