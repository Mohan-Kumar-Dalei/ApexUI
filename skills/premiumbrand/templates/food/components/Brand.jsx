/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import gsap from 'gsap';
import { reduced } from '../lib/motion.jsx';

// The sun badge with the wordmark across it, drawn the same way as on the 3D bags.
export function SunMark({ className = '' }) {
    return (
        <svg viewBox="0 0 230 190" className={className} aria-label="Lay's" role="img">
            <circle cx="115" cy="95" r="80" fill="#fff" />
            <circle cx="115" cy="95" r="74" fill="#F4C20D" />
            <g transform="translate(115 95)" fill="#E3A90A" opacity="0.6">
                {Array.from({ length: 24 }).map((_, i) => (
                    <path key={i} d="M-3 40 L3 40 L0 68 Z" transform={`rotate(${i * 15})`} />
                ))}
            </g>
            <ellipse cx="115" cy="95" rx="96" ry="30" fill="#D3262D" transform="rotate(-7 115 95)" />
            <text x="115" y="97" textAnchor="middle" dominantBaseline="middle" transform="rotate(-7 115 95)" fontFamily="Fraunces" fontStyle="italic" fontWeight="900" fontSize="44" fill="#fff" stroke="#8E1B1B" strokeWidth="2" paintOrder="stroke">
                Lay's
            </text>
        </svg>
    );
}

// A pill button with its arrow in a circle that turns on hover.
export function ArrowPill({ as: Tag = 'button', tone = 'accent', children, className = '', ...rest }) {
    const tones = {
        accent: 'bg-accent text-white hover:bg-accent-deep [&_[data-arrow]]:bg-white [&_[data-arrow]]:text-accent',
        white: 'bg-white text-ink hover:bg-bg [&_[data-arrow]]:bg-ink [&_[data-arrow]]:text-white',
        ink: 'bg-ink text-bg hover:bg-black [&_[data-arrow]]:bg-sun [&_[data-arrow]]:text-ink',
        sun: 'bg-sun text-ink hover:bg-sun-deep [&_[data-arrow]]:bg-ink [&_[data-arrow]]:text-sun',
    };
    return (
        <Tag className={`group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-[15px] font-bold transition-colors duration-300 disabled:opacity-50 ${tones[tone]} ${className}`} {...rest}>
            <span>{children}</span>
            <span data-arrow className="grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 ease-expo group-hover:rotate-45">
                <ArrowUpRight size={18} strokeWidth={2.4} />
            </span>
        </Tag>
    );
}

export function HeartButton({ on, onClick, className = '', label = 'Save to your list' }) {
    return (
        <button type="button" onClick={onClick} aria-pressed={on} aria-label={on ? 'Remove from your list' : label} className={`grid h-9 w-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-90 ${className}`}>
            <Heart size={18} strokeWidth={2.2} className={on ? 'fill-accent text-accent' : ''} />
        </button>
    );
}

// Horizontal or vertical running strip (the Marquee idea, restyled).
export function Marquee({ children, vertical = false, reverse = false, duration = 42, gap = '2.5rem', className = '', pauseOnHover = false }) {
    return (
        <div className={`group flex overflow-hidden ${vertical ? 'flex-col' : 'flex-row'} ${className}`} style={{ '--marquee-duration': `${duration}s`, '--marquee-gap': gap, gap }}>
            {[0, 1].map((k) => (
                <div
                    key={k}
                    aria-hidden={k === 1}
                    className={`flex shrink-0 ${vertical ? 'flex-col animate-marquee-y' : 'flex-row animate-marquee'} ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
                    style={{ gap, animationDirection: reverse ? 'reverse' : 'normal' }}
                >
                    {children}
                </div>
            ))}
        </div>
    );
}

// Counts up once when it comes into view (the Number Ticker idea, restyled).
export function NumberTicker({ value, decimals = 0, className = '' }) {
    const ref = useRef(null);
    const [n, setN] = useState(reduced() ? value : 0);
    useEffect(() => {
        if (reduced()) return undefined;
        const obj = { v: 0 };
        let tween;
        const io = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return;
                io.disconnect();
                tween = gsap.to(obj, { v: value, duration: 2, ease: 'expo.out', onUpdate: () => setN(obj.v) });
            },
            { threshold: 0.4 },
        );
        io.observe(ref.current);
        return () => {
            io.disconnect();
            tween?.kill();
        };
    }, [value]);
    return (
        <span ref={ref} className={`tabular-nums ${className}`}>
            {n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        </span>
    );
}

export function Diamond({ className = '' }) {
    return <span aria-hidden="true" className={`inline-block h-2 w-2 rotate-45 bg-gold ${className}`} />;
}
