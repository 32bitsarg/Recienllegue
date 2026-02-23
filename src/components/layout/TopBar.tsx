"use client";

import { Search, MapPin } from "lucide-react";
import Link from "next/link";
import styles from "./TopBar.module.css";

const TopBar = () => {
    return (
        <header className={styles.header}>
            <div className={styles.leftContainer}>
                <div className={styles.location}>
                    <MapPin size={14} className={styles.pin} />
                    <span>Pergamino</span>
                </div>
            </div>
            <div className={styles.brand}>
                <img src="/assets/icons/Iconrmbg.png" alt="Recien Llegue Icon" className={styles.appIcon} />
                <h1 className={styles.logo}>Recien<span>Llegue</span></h1>
                <span className={styles.versionBadge}>v0.1.0</span>
            </div>
            <Link href="/buscar" className={styles.searchBtn}>
                <div className={styles.searchIconWrapper}>
                    <Search size={18} />
                </div>
            </Link>
        </header>
    );
};

export default TopBar;
