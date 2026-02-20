"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.12, ease: [0.23, 1, 0.32, 1] }}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    width: "100%",
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
