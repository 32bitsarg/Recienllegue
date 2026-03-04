import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import styles from "./mapa.module.css";

export default function MapPage() {
    return (
        <>
            {/* Mobile */}
            <div className="mobile-only">
                <div className="app-shell">
                    <main className="safe-bottom" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <TopBar />
                        <div className={styles.container}>
                            <div className={styles.card}>
                                <div className={styles.iconWrapper}>
                                    <svg className={styles.mapSvg} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Map base folds */}
                                        <path d="M30 50 L70 35 L130 55 L170 40 L170 150 L130 165 L70 145 L30 160 Z" fill="url(#mapGradient)" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
                                        <path d="M70 35 L70 145" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" />
                                        <path d="M130 55 L130 165" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" />

                                        {/* Road/path lines */}
                                        <path d="M45 80 Q80 95 100 85 T155 100" stroke="#c7d2fe" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                        <path d="M50 120 Q90 105 110 115 T160 130" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" fill="none" />

                                        {/* Pin 1 - bouncing */}
                                        <g className={styles.pin1}>
                                            <ellipse cx="85" cy="88" rx="5" ry="2" fill="rgba(99,102,241,0.2)" />
                                            <path d="M85 85 C85 75, 75 68, 75 60 C75 52, 81 46, 85 46 C89 46, 95 52, 95 60 C95 68, 85 75, 85 85Z" fill="#6366f1" />
                                            <circle cx="85" cy="60" r="4" fill="white" />
                                        </g>

                                        {/* Pin 2 - bouncing delayed */}
                                        <g className={styles.pin2}>
                                            <ellipse cx="135" cy="105" rx="5" ry="2" fill="rgba(244,63,94,0.2)" />
                                            <path d="M135 102 C135 92, 125 85, 125 77 C125 69, 131 63, 135 63 C139 63, 145 69, 145 77 C145 85, 135 92, 135 102Z" fill="#f43f5e" />
                                            <circle cx="135" cy="77" r="4" fill="white" />
                                        </g>

                                        {/* Gear / construction indicator */}
                                        <g className={styles.gear} transform="translate(155, 45)">
                                            <circle cx="0" cy="0" r="10" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                                            <path d="M0 -13 L2 -8 L-2 -8Z M0 13 L2 8 L-2 8Z M-13 0 L-8 -2 L-8 2Z M13 0 L8 -2 L8 2Z M-9 -9 L-5 -7 L-7 -5Z M9 9 L5 7 L7 5Z M-9 9 L-7 5 L-5 7Z M9 -9 L7 -5 L5 -7Z" fill="#6366f1" />
                                            <circle cx="0" cy="0" r="4" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                                        </g>

                                        <defs>
                                            <linearGradient id="mapGradient" x1="30" y1="50" x2="170" y2="160" gradientUnits="userSpaceOnUse">
                                                <stop offset="0%" stopColor="#eef2ff" />
                                                <stop offset="50%" stopColor="#e0e7ff" />
                                                <stop offset="100%" stopColor="#c7d2fe" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                <h2 className={styles.title}>Mapa en construcción</h2>
                                <p className={styles.description}>
                                    Estamos ajustando los puntos de interés para que tengas la mejor guía de Pergamino. ¡Volvé pronto!
                                </p>

                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} />
                                </div>
                                <span className={styles.progressLabel}>Trabajando en ello...</span>
                            </div>
                        </div>
                        <BottomNav />
                    </main>
                </div>
            </div>

            {/* Desktop */}
            <div className="desktop-only" style={{ width: '100%', height: '100%' }}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <svg className={styles.mapSvg} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Map base folds */}
                                <path d="M30 50 L70 35 L130 55 L170 40 L170 150 L130 165 L70 145 L30 160 Z" fill="url(#mapGradientD)" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M70 35 L70 145" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" />
                                <path d="M130 55 L130 165" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 3" />

                                {/* Road/path lines */}
                                <path d="M45 80 Q80 95 100 85 T155 100" stroke="#c7d2fe" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                                <path d="M50 120 Q90 105 110 115 T160 130" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" fill="none" />

                                {/* Pin 1 */}
                                <g className={styles.pin1}>
                                    <ellipse cx="85" cy="88" rx="5" ry="2" fill="rgba(99,102,241,0.2)" />
                                    <path d="M85 85 C85 75, 75 68, 75 60 C75 52, 81 46, 85 46 C89 46, 95 52, 95 60 C95 68, 85 75, 85 85Z" fill="#6366f1" />
                                    <circle cx="85" cy="60" r="4" fill="white" />
                                </g>

                                {/* Pin 2 */}
                                <g className={styles.pin2}>
                                    <ellipse cx="135" cy="105" rx="5" ry="2" fill="rgba(244,63,94,0.2)" />
                                    <path d="M135 102 C135 92, 125 85, 125 77 C125 69, 131 63, 135 63 C139 63, 145 69, 145 77 C145 85, 135 92, 135 102Z" fill="#f43f5e" />
                                    <circle cx="135" cy="77" r="4" fill="white" />
                                </g>

                                {/* Gear */}
                                <g className={styles.gear} transform="translate(155, 45)">
                                    <circle cx="0" cy="0" r="10" fill="white" stroke="#6366f1" strokeWidth="1.5" />
                                    <path d="M0 -13 L2 -8 L-2 -8Z M0 13 L2 8 L-2 8Z M-13 0 L-8 -2 L-8 2Z M13 0 L8 -2 L8 2Z M-9 -9 L-5 -7 L-7 -5Z M9 9 L5 7 L7 5Z M-9 9 L-7 5 L-5 7Z M9 -9 L7 -5 L5 -7Z" fill="#6366f1" />
                                    <circle cx="0" cy="0" r="4" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                                </g>

                                <defs>
                                    <linearGradient id="mapGradientD" x1="30" y1="50" x2="170" y2="160" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#eef2ff" />
                                        <stop offset="50%" stopColor="#e0e7ff" />
                                        <stop offset="100%" stopColor="#c7d2fe" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <h1 className={styles.title}>Mapa en construcción</h1>
                        <p className={styles.description}>
                            Estamos ajustando los puntos de interés para que tengas la mejor guía interactiva de Pergamino.
                            <br />¡Volvé pronto, va a valer la pena!
                        </p>

                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} />
                        </div>
                        <span className={styles.progressLabel}>Trabajando en ello...</span>
                    </div>
                </div>
            </div>
        </>
    );
}
