"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, User, Bell } from "lucide-react";
import styles from "./BottomNav.module.css";
import { motion } from "framer-motion";

const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { icon: <Home size={18} />, label: "Inicio", href: "/" },
        { icon: <MapPin size={18} />, label: "Mapa", href: "/mapa" },
        { icon: <Bell size={18} />, label: "Avisos", href: "/avisos" },
        { icon: <User size={18} />, label: "Perfil", href: "/perfil" },
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.item} ${isActive ? styles.active : ""}`}
                        >
                            <span className={styles.icon}>
                                {item.icon}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={styles.activeBubble}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
