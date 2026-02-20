"use client";

import React from "react";
import styles from "./EmptyState.module.css";
import { motion } from "framer-motion";

interface EmptyStateProps {
    title?: string;
    message?: string;
}

export default function EmptyState({
    title = "Acá no hay nada :/",
    message = "Todavía no se ha subido información en esta sección."
}: EmptyStateProps) {
    return (
        <div className={styles.container}>
            <motion.div
                className={styles.videoWrapper}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <video
                    src="/assets/videos/nothing.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.video}
                />
            </motion.div>

            <motion.h3
                className={styles.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h3>

            <motion.p
                className={styles.message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                {message}
            </motion.p>
        </div>
    );
}
