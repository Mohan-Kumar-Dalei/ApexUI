import React, { useRef, useEffect } from "react";

export default function PointerFollower({ offsetY = 0 }) {
    const followerRef = useRef(null);
    const containerRef = useRef(null);
    // We'll use state for position
    const [pos, setPos] = React.useState({ x: 80, y: 80 });
    const [visible, setVisible] = React.useState(false);

    // Mouse move handler for the card only
    useEffect(() => {
        const container = containerRef.current?.parentElement;
        if (!container) return;
        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top + offsetY;
            setPos({ x, y });
            setVisible(true);
        };
        const handleLeave = () => setVisible(false);
        container.addEventListener("pointermove", handleMove);
        container.addEventListener("pointerleave", handleLeave);
        return () => {
            container.removeEventListener("pointermove", handleMove);
            container.removeEventListener("pointerleave", handleLeave);
        };
    }, [offsetY]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            {visible && (
                <div
                    ref={followerRef}
                    style={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        transform: "translate(-20%, 10%)",
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    <div className="w-32 h-12 rounded-full bg-gradient-to-br from-slate-950 to-slate-800 shadow-2xl border-2 border-white/30 backdrop-blur-lg flex items-center justify-center relative px-4">
                        <div className="absolute inset-0 rounded-full pointer-events-none"  style={{ boxShadow: '0 0 32px 8px #a855f7aa, 0 0 0 2px #fff2' }}></div>
                        <span className="text-white text-[70%] font-semibold tracking-wide select-none z-10">John Doe — Product Manager</span>
                    </div>
                </div>
            )}
        </div>
    );
}
