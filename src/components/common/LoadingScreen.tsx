"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simulate initial loading or wait for global state
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <div className={styles.container}>
                        <div className={styles.videoWrapper}>
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                webkit-playsinline="true"
                                preload="auto"
                                className={styles.video}
                            >
                                <source src="/assets/videos/loadingscreen.webm" type="video/webm" />
                                <source src="/assets/videos/loadingscreen.mp4" type="video/mp4" />
                                Tu navegador no soporta videos.
                            </video>
                        </div>

                        <motion.div
                            className={styles.textContainer}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className={styles.title}>Recien<span>Llegue</span></h2>
                            <p className={styles.slogan}>Porque todos llegamos por primera vez</p>
                        </motion.div>

                        <div className={styles.loaderLine}>
                            <motion.div
                                className={styles.progress}
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
