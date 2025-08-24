import React from "react";

// Modern moving border with solid color (no gradient)
const badgeStyle = {
    display: 'inline-block',
    minWidth: '1.1em',
    textAlign: 'center',
    lineHeight: '1',
    border: 'none',
    position: 'relative',
    zIndex: 0,
};

export default function SidebarBadge({ children, className }) {
    React.useEffect(() => {
        const styleId = 'apexui-badge-moving-border';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes badge-move {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .apexui-badge-moving-border {
                    position: relative;
                    z-index: 0;
                }
                .apexui-badge-moving-border::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 9999px;
                    padding: 1px;
                    background: linear-gradient(90deg, #171717 40%, #00d492 60%, #171717 100%);
                    background-size: 200% 200%;
                    animation: badge-move 2s linear infinite;
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                    z-index: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <span
            className={`ml-2 text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold bg-[var(--hero-nav-badge)] text-[var(--hero-nav-badge-text)] shadow apexui-badge-moving-border ${className}`}
            style={badgeStyle}
        >
            {children}
        </span>
    );
}
