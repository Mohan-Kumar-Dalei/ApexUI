import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, ShoppingBasket, X } from 'lucide-react';
import { useStore } from '../lib/store.jsx';
import { scrollToId, useScrollLock } from '../lib/motion.jsx';
import { setSound, soundOn } from '../lib/sound.js';

export const LINKS = [
    ['flavors', 'Flavors'],
    ['inside', 'Inside'],
    ['shop', 'Shop'],
    ['range', 'Range'],
    ['qa', 'Q&A'],
    ['join', 'Join'],
];

// The Lay's logo (the brand's own artwork, from lays.com).
export function Badge({ className = '' }) {
    return <img src={`${import.meta.env.BASE_URL}brand/lays-logo.png`} alt="" width="134" height="125" className={`object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] ${className}`} />;
}

export default function Nav() {
    const { count, setBagOpen } = useStore();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const home = pathname === '/';
    const [tone, setTone] = useState('dark');
    const [current, setCurrent] = useState('flavors');
    const [menu, setMenu] = useState(false);
    const [sound, setSoundState] = useState(soundOn);
    useScrollLock(menu);

    // light or dark pill, from the section under the nav
    useEffect(() => {
        // the last (innermost) toned element that spans the nav's line
        const on = () => {
            let t = home ? 'dark' : 'light';
            document.querySelectorAll('[data-tone]').forEach((el) => {
                const r = el.getBoundingClientRect();
                if (r.top <= 46 && r.bottom >= 46) t = el.dataset.tone;
            });
            setTone(t);
        };
        on();
        addEventListener('scroll', on, { passive: true });
        addEventListener('resize', on);
        return () => {
            removeEventListener('scroll', on);
            removeEventListener('resize', on);
        };
    }, [home]);

    // the section in view gets the solid pill
    useEffect(() => {
        if (!home) return undefined;
        const els = LINKS.map(([id]) => document.getElementById(id)).filter(Boolean);
        const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [home]);

    const go = (id) => {
        setMenu(false);
        if (home) scrollToId(id);
        else navigate(`/#${id}`);
    };
    const dark = tone === 'dark';
    const pill = dark ? 'border-white/20 bg-black/15 text-white' : 'border-coal/10 bg-white/55 text-coal';

    return (
        <>
            <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-7">
                <nav aria-label="Main" className="pointer-events-auto mx-auto flex max-w-[1760px] items-center gap-3">
                    <Link to="/" onClick={(e) => home && (e.preventDefault(), go('flavors'))} className={`flex shrink-0 items-center gap-3 ${dark ? 'text-white' : 'text-coal'}`} aria-label="Lay's Crunch Lab, home">
                        <Badge className="h-12 w-12 text-[20px] sm:h-14 sm:w-14" />
                        <span className="mono hidden !text-[12px] sm:block">Crunch Lab</span>
                    </Link>
                    <ul className={`mx-auto hidden items-center gap-1 rounded-full border p-1.5 backdrop-blur-md transition-colors duration-500 lg:flex ${pill}`}>
                        {LINKS.map(([id, label]) => {
                            const on = current === id && home;
                            return (
                                <li key={id}>
                                    <button onClick={() => go(id)} aria-current={on ? 'true' : undefined} className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300 ${on ? (dark ? 'bg-white text-coal' : 'bg-coal text-white') : dark ? 'hover:bg-white/10' : 'hover:bg-coal/5'}`}>
                                        {label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <button
                            onClick={() => {
                                setSound(!sound);
                                setSoundState(!sound);
                            }}
                            aria-pressed={sound}
                            aria-label={sound ? 'Turn crunch sounds off' : 'Turn crunch sounds on'}
                            className={`hidden h-12 items-center gap-2.5 rounded-full border px-4 backdrop-blur-md transition-colors sm:flex ${pill}`}
                        >
                            <span className="flex items-end gap-[3px]" aria-hidden="true">
                                {[0, 1, 2, 3].map((i) => (
                                    <span key={i} className={`w-[3px] rounded-full bg-current transition-all duration-300 ${sound ? 'animate-pulse' : ''}`} style={{ height: sound ? 6 + ((i * 5) % 9) : 3, animationDelay: `${i * 120}ms` }} />
                                ))}
                            </span>
                            <span className="mono !text-[12px]">{sound ? 'On' : 'Off'}</span>
                        </button>
                        <button onClick={() => setBagOpen(true)} className={`flex h-12 items-center gap-2.5 rounded-full border px-4 backdrop-blur-md transition-colors ${pill}`} aria-label={`Open basket, ${count} packs`}>
                            <ShoppingBasket size={18} strokeWidth={2.2} />
                            <span className="flex gap-1" aria-hidden="true">
                                {[0, 1, 2].map((i) => (
                                    <span key={i} className={`h-2 w-2 rounded-full border transition-colors ${i < count ? 'border-[#FF6A2B] bg-[#FF6A2B]' : 'border-current'}`} />
                                ))}
                            </span>
                            {count > 3 && <span className="text-[13px] font-bold tabular-nums">{count}</span>}
                        </button>
                        <button onClick={() => go('join')} className="hidden h-12 items-center rounded-full bg-[#FF6A2B] px-6 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(255,106,43,0.35)] transition-transform hover:-translate-y-0.5 md:flex">
                            First dibs
                        </button>
                        <button onClick={() => setMenu((m) => !m)} className={`grid h-12 w-12 place-items-center rounded-full border backdrop-blur-md lg:hidden ${pill}`} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>
                            {menu ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </nav>
            </header>
            <div className={`fixed inset-0 z-40 bg-coal px-6 pb-10 pt-28 text-white transition-[clip-path] duration-700 ease-expo lg:hidden ${menu ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'}`} aria-hidden={!menu}>
                <ul className="flex flex-col gap-1">
                    {LINKS.map(([id, label], i) => (
                        <li key={id}>
                            <button tabIndex={menu ? 0 : -1} onClick={() => go(id)} className="flex w-full items-baseline gap-4 border-b border-white/15 py-4 text-left font-wide text-4xl">
                                <span className="mono !text-[11px] text-white/50">0{i + 1}</span>
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
                <Link tabIndex={menu ? 0 : -1} to="/track" onClick={() => setMenu(false)} className="mono mt-8 inline-block text-white/70 underline underline-offset-4">
                    Track an order
                </Link>
            </div>
        </>
    );
}

// The thin frame round the page with plus marks in the corners, like a print proof.
export function Frame() {
    return (
        <div className="pointer-events-none fixed inset-2 z-[45] rounded-[22px] border border-current/15 text-white mix-blend-difference sm:inset-3" aria-hidden="true">
            {['left-6 top-[104px]', 'right-6 top-[104px]', 'bottom-6 left-6', 'bottom-6 right-6'].map((p) => (
                <span key={p} className={`absolute h-4 w-4 ${p}`}>
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current/70" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current/70" />
                </span>
            ))}
        </div>
    );
}
