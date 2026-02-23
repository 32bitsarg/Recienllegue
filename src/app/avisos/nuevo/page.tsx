import MobileAvisoNuevo from "@/components/mobile/MobileAvisoNuevo";

export default function NuevoAvisoPage() {
    return (
        <main className="safe-bottom">
            <div className="mobile-only">
                <MobileAvisoNuevo />
            </div>
            <div className="desktop-only text-center" style={{ padding: '6rem 2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Volviendo al muro...</h2>
                <script dangerouslySetInnerHTML={{ __html: "window.location.href='/avisos'" }} />
            </div>
        </main>
    );
}
