import MagneticCursor from '../../components/MainUI/ApexUI-Kit/MagneticCursor/MagneticCursor.jsx';
import LiquidBlob3D from '../../components/MainUI/ApexUI-Kit/LiquidBlob3D/LiquidBlob3D.jsx';
import RotatingText from '../../components/MainUI/ApexUI-Kit/RotatingText/RotatingText.jsx';
import RollingCounter from '../../components/MainUI/ApexUI-Kit/RollingCounter/RollingCounter.jsx';
import PixelTransition from '../../components/MainUI/ApexUI-Kit/PixelTransition/PixelTransition.jsx';
import ProximityText from '../../components/MainUI/ApexUI-Kit/ProximityText/ProximityText.jsx';
import AccordionMarquee from '../../components/MainUI/ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';
import HoverText from '../../components/MainUI/ApexUI-Kit/HoverText/HoverText.jsx';
import { photo } from './photos.js';

const BONE = '#ece6da';
const ACCENT = '#ff4d2e';

const AWARDS = [
    [12, 'Awwwards', 'Sites of the Day'],
    [8, 'FWA', 'of the Day'],
    [5, 'CSS Design Awards', 'Best UI'],
    [3, 'Webby', 'Honorees'],
];

const WORK = [
    { name: 'Aurelia', kind: 'Brand world, 2026', img: 'photo-1618005182384-a83a8bd57fbe' },
    { name: 'Monolith', kind: 'Product launch, 2026', img: 'photo-1600185365483-26d7a4cc7519' },
    { name: 'Tidewater', kind: 'Campaign site, 2025', img: 'photo-1518837695005-2083093ee35b' },
];

const SERVICES = [
    { title: 'Brand worlds', text: 'Identity, voice, motion language', image: photo('photo-1618005182384-a83a8bd57fbe', 500) },
    { title: 'Web experiences', text: 'WebGL, scroll stories, launches', image: photo('photo-1550745165-9bc0b252726f', 500) },
    { title: 'Product design', text: 'Apps people want to open', image: photo('photo-1551288049-bebda4e38f71', 500) },
    { title: 'Motion & 3D', text: 'Films, loops, real-time scenes', image: photo('photo-1600185365483-26d7a4cc7519', 500) },
];

/* Obsidian: an award-winning creative agency. The whole page has a magnetic cursor. */
export default function ObsidianTemplate() {
    return (
        <MagneticCursor color={ACCENT} className="!block">
            <div className="bg-[#0a0a0a]" style={{ color: BONE }}>
                <header className="flex items-center justify-between px-[clamp(1rem,4vw,3rem)] py-6 text-sm">
                    <span className="font-black tracking-[0.2em]">OBSIDIAN®</span>
                    <nav className="flex gap-6 opacity-70">
                        <a href="#work">Work</a>
                        <a href="#studio" className="hidden sm:inline">
                            Studio
                        </a>
                        <a href="#contact">Contact</a>
                    </nav>
                </header>

                <section className="relative overflow-hidden px-[clamp(1rem,4vw,3rem)] pb-[clamp(3rem,8vw,6rem)] pt-[clamp(2rem,6vw,5rem)]">
                    <div className="pointer-events-none absolute -right-[10%] top-1/2 hidden -translate-y-1/2 opacity-90 md:block">
                        <LiquidBlob3D colors={[ACCENT, '#ffb199', '#6b21a8']} size={30} distortion={0.3} />
                    </div>
                    <p className="relative font-mono text-xs uppercase tracking-[0.3em] opacity-60">Independent studio · Est. 2012</p>
                    <h1 className="relative mt-6 text-[clamp(3rem,11vw,10rem)] font-black uppercase leading-[0.85] tracking-[-0.04em]">
                        We make
                        <br />
                        the internet
                    </h1>
                    <div className="relative mt-4 text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-none tracking-tight">
                        <RotatingText prefix="feel" words={['alive.', 'rare.', 'loud.', 'human.']} accentColor={ACCENT} textColor="#0a0a0a" />
                    </div>
                </section>

                <section className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4">
                    {AWARDS.map(([n, org, what]) => (
                        <div key={org} className="border-white/10 px-[clamp(1rem,3vw,2rem)] py-8 [&:not(:last-child)]:border-r">
                            <RollingCounter value={n} prefix="×" fontSize={2.6} fontWeight={900} />
                            <p className="mt-2 text-sm font-semibold">{org}</p>
                            <p className="text-xs opacity-50">{what}</p>
                        </div>
                    ))}
                </section>

                <section id="work" className="px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,9vw,7rem)]">
                    <div className="mb-10 flex items-end justify-between">
                        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none tracking-tight">Selected work</h2>
                        <span className="font-mono text-xs opacity-50">Hover a project</span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {WORK.map((w) => (
                            <div key={w.name} data-cursor-text="View">
                                <PixelTransition
                                    width={40}
                                    aspectRatio="3 / 4"
                                    pixelColor={ACCENT}
                                    className="!w-full"
                                    first={<img src={photo(w.img, 900)} alt={w.name} className="h-full w-full object-cover" />}
                                    second={
                                        <div className="flex h-full flex-col justify-end p-6" style={{ background: ACCENT, color: '#0a0a0a' }}>
                                            <p className="text-4xl font-black uppercase leading-none">{w.name}</p>
                                            <p className="mt-2 text-sm font-semibold">{w.kind}</p>
                                        </div>
                                    }
                                />
                                <p className="mt-3 flex justify-between text-sm">
                                    <span className="font-bold uppercase">{w.name}</span>
                                    <span className="opacity-50">{w.kind}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="studio" className="border-t border-white/10 px-[clamp(1rem,4vw,3rem)] py-[clamp(4rem,9vw,7rem)]">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">The studio</p>
                    <div className="mt-6 max-w-5xl text-[clamp(1.6rem,3.6vw,3.2rem)] font-semibold leading-[1.15]">
                        <ProximityText text="Thirty people who think the web should feel like a place, not a page." activeColor={ACCENT} maxScale={1.25} />
                    </div>
                </section>

                <AccordionMarquee items={SERVICES} bgColor={ACCENT} textColor="#0a0a0a" menuBg="#0a0a0a" menuColor={BONE} lineColor="rgba(236,230,218,0.14)" showIndex height="30rem" />

                <section id="contact" className="flex flex-col items-center px-6 py-[clamp(5rem,12vw,9rem)] text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">Have a project?</p>
                    <div className="mt-4" data-magnetic>
                        <HoverText text="LET'S TALK" fontSize="clamp(3rem, 11vw, 9rem)" effectColor={ACCENT} textColor={BONE} />
                    </div>
                    <a href="#contact" className="mt-6 text-lg underline decoration-1 underline-offset-8 opacity-80">
                        hello@obsidian.studio
                    </a>
                </section>

                <footer className="flex flex-col justify-between gap-2 border-t border-white/10 px-[clamp(1rem,4vw,3rem)] py-8 text-xs opacity-50 sm:flex-row">
                    <span>© Obsidian Studio, Lisbon · Berlin</span>
                    <span>Instagram · Dribbble · LinkedIn</span>
                </footer>
            </div>
        </MagneticCursor>
    );
}
