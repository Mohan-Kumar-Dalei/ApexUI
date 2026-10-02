import { useState } from 'react';
import { motion } from 'framer-motion';

/*
 * Wraps a full-bleed background component with sample page content and a
 * "Demo UI" switch, so visitors can see the effect with and without content.
 */
export default function BackgroundDemo({ title, subtitle = 'A beautiful animated background for your UI.', children, height = 'self-stretch min-h-[clamp(26rem,64vh,60rem)]' }) {
    const [showDemo, setShowDemo] = useState(true);
    return (
        <div className={`relative flex w-full items-center justify-center overflow-hidden ${height}`}>
            <div className="absolute inset-0 flex items-center justify-center">{children}</div>
            <div
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-4 transition-opacity duration-500"
                style={{ opacity: showDemo ? 1 : 0 }}
            >
                <nav className="mb-8 flex w-full max-w-md items-center justify-between rounded-full border border-white/10 bg-black/20 px-6 py-3 shadow-lg backdrop-blur-sm">
                    <span className="text-lg font-semibold text-white">Demo Nav</span>
                    <div className="flex gap-4 text-sm font-medium text-white/70">
                        <span>Home</span>
                        <span>About</span>
                    </div>
                </nav>
                <h2 className="mb-2 text-center text-4xl font-extrabold text-white drop-shadow-lg md:text-5xl">{title}</h2>
                <p className="max-w-md text-center text-lg text-white/80">{subtitle}</p>
            </div>
            <button
                type="button"
                onClick={() => setShowDemo((v) => !v)}
                aria-pressed={showDemo}
                className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 py-1 pl-3 pr-1 text-xs text-white/80 backdrop-blur"
            >
                Demo UI
                <span className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${showDemo ? 'justify-end bg-lime-400' : 'justify-start bg-white/20'}`}>
                    <motion.span layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className="h-4 w-4 rounded-full bg-white shadow" />
                </span>
            </button>
        </div>
    );
}
