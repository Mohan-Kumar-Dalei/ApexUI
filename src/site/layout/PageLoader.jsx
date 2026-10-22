import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/*
 * Shown in the content area while a page's code downloads. It waits a moment
 * before appearing so fast loads never flash it, then shows three bouncing bars.
 */
export default function PageLoader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setVisible(true), 180);
        return () => clearTimeout(id);
    }, []);

    return (
        <div role="status" aria-live="polite" aria-label="Loading the page" className="flex min-h-[70vh] items-center justify-center">
            {visible && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex h-8 items-end gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="w-1.5 rounded-full bg-[var(--lime)]"
                            animate={{ height: ['30%', '100%', '30%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
