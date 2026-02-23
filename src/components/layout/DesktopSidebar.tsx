"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    Home,
    MapPin,
    Bell,
    User,
    LogOut
} from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import styles from "./DesktopSidebar.module.css";

const NAV_ITEMS = [
    { icon: <Home size={18} />, label: "Inicio", href: "/" },
    { icon: <MapPin size={18} />, label: "Mapa", href: "/mapa" },
    { icon: <Bell size={18} />, label: "Avisos", href: "/avisos" },
    { icon: <User size={18} />, label: "Perfil", href: "/perfil" },
];

const DesktopSidebar = memo(function DesktopSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isActive = (href: string) => pathname === href;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoArea}>
                <div className={styles.brandWrapper}>
                    <div style={{ position: 'relative', width: 40, height: 40 }}>
                        <Image
                            src="/assets/icons/Iconrmbg.png"
                            alt="Logo"
                            fill
                            priority
                            sizes="40px"
                            className={styles.appIcon}
                        />
                    </div>
                    <div className={styles.brandText}>
                        <h1 className={styles.logo}>Recien<span>Llegue</span></h1>
                        <span className={styles.versionBadge}>v0.1.0</span>
                    </div>
                </div>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${isActive(item.href) ? styles.active : ""}`}
                    >
                        <div className={styles.iconWrapper}>
                            {item.icon}
                        </div>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                {session ? (
                    <div className={styles.userCard}>
                        <div className={styles.avatar}>
                            {(session.user as any).image ? (
                                <Image
                                    src={(session.user as any).image}
                                    alt="Profile"
                                    fill
                                    sizes="36px"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <UserAvatar
                                    seed={(session.user as any).avatarSeed || session.user?.email || "default"}
                                    size={36}
                                />
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{session.user?.name?.split(' ')[0]}</span>
                            <span className={styles.userRole}>{(session.user as any).role || "Estudiante"}</span>
                        </div>
                        <button className={styles.logoutBtn} onClick={() => signOut()} title="Cerrar sesión">
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className={styles.loginBtn}>
                        <User size={18} />
                        <span>Entrar</span>
                    </Link>
                )}
            </div>
        </aside>
    );
});

export default DesktopSidebar;
