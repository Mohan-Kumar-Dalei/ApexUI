import { CloudSun, Download, Play } from 'lucide-react';
import LiquidGlass from '../../components/MainUI/ApexUI-Kit/LiquidGlass/LiquidGlass.jsx';
import CircularCarousel from '../../components/MainUI/ApexUI-Kit/CircularCarousel/CircularCarousel.jsx';
import AccordionMarquee from '../../components/MainUI/ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';
import Galaxy3D from '../../components/MainUI/ApexUI-Kit/Galaxy3D/Galaxy3D.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { Footer, Section } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#93c5fd';

// The hero is one Liquid Glass scene: a glass nav bar, two glass buttons and a
// weather widget over a photo, with the headline underneath. Not draggable:
// this is how you would use it on a real page.
const HERO_GLASS = [
    {
        id: 'nav',
        x: 0.5,
        y: 0.085,
        width: 0.92,
        maxWidth: 760,
        height: 56,
        radius: 28,
        content: (
            <div className="flex h-full items-center justify-between pl-5 pr-2 text-white">
                <span className="text-lg font-black tracking-tight">Lumen</span>
                <span className="hidden items-center gap-6 text-sm text-white/85 sm:flex">
                    <a href="#features">Features</a>
                    <a href="#screens">Screens</a>
                    <a href="#download">Download</a>
                </span>
                <a href="#download" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
                    Get the app
                </a>
            </div>
        ),
    },
    {
        id: 'download',
        x: 0.5,
        y: 0.72,
        offset: -84,
        width: 156,
        height: 54,
        radius: 27,
        content: (
            <a href="#download" className="flex h-full items-center justify-center gap-2 text-sm font-semibold text-white">
                <Download className="h-4 w-4" /> Download
            </a>
        ),
    },
    {
        id: 'film',
        x: 0.5,
        y: 0.72,
        offset: 84,
        width: 156,
        height: 54,
        radius: 27,
        content: (
            <a href="#screens" className="flex h-full items-center justify-center gap-2 text-sm font-semibold text-white">
                <Play className="h-4 w-4" /> Watch film
            </a>
        ),
    },
    {
        id: 'weather',
        x: 0.84,
        y: 0.4,
        width: 168,
        height: 120,
        radius: 30,
        content: (
            <div className="flex h-full flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs font-semibold text-white/90">
                    Zermatt <CloudSun className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-3xl font-light leading-none">-4°</p>
                    <p className="mt-1 text-[0.7rem] text-white/80">Clear · sunrise 7:12</p>
                </div>
            </div>
        ),
    },
];

const SCREENS = [
    ['photo-1506905925346-21bda4d32df4', 'Morning'],
    ['photo-1477959858617-67f85cf4f1df', 'Commute'],
    ['photo-1505144808419-1957a94ca61e', 'Weekend'],
    ['photo-1441974231531-c6227db76b6e', 'Focus'],
    ['photo-1480714378408-67cf0d13bc1b', 'Evening'],
    ['photo-1518837695005-2083093ee35b', 'Swim'],
    ['photo-1470770841072-f978cf4d019e', 'Hike'],
    ['photo-1449824913935-59a10b8d2000', 'Night'],
].map(([id, title]) => ({ src: photo(id, 700), title }));

const FEATURES = [
    { title: 'Live widgets', text: 'Weather that breathes', image: photo('photo-1501785888041-af3ef285b470', 500) },
    { title: 'Focus mode', text: 'Quiet hours that stick', image: photo('photo-1441974231531-c6227db76b6e', 500) },
    { title: 'Smart alarms', text: 'Wake with the sunrise', image: photo('photo-1500964757637-c85e8a162699', 500) },
    { title: 'Everywhere', text: 'iPhone, iPad and Mac', image: photo('photo-1511300636408-a63a89df3482', 500) },
];

/* Lumen: a weather and focus app, with a Liquid Glass hero. */
export default function LumenTemplate() {
    return (
        <div className="bg-[#0b0e18] text-white">
            <LiquidGlass items={HERO_GLASS} image={photo('photo-1506905925346-21bda4d32df4', 2200)} draggable={false} frost={0.15} height="min(100svh, 52rem)">
                <div className="flex h-full flex-col items-center justify-center px-6 pb-[14%] text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/80">Lumen for iPhone</p>
                    <h1 className="mt-3 max-w-3xl text-[clamp(2.4rem,7vw,5.6rem)] font-black leading-[0.95] tracking-tight">Your day, in a clearer light</h1>
                    <p className="mt-4 max-w-md text-white/85">Weather, focus and gentle alarms in one calm app.</p>
                </div>
            </LiquidGlass>

            <Section eyebrow="Screens" title="A view for every hour" text="Drag or flick the ring, click a card to bring it forward.">
                <div id="screens" />
                <CircularCarousel items={SCREENS} fadeColor="#0b0e18" height="28rem" />
            </Section>

            <Section eyebrow="Features" title="Small things, done well" className="!px-0">
                <div id="features" />
                <AccordionMarquee items={FEATURES} bgColor={ACCENT} textColor="#0b0e18" menuBg="#0b0e18" height="26rem" />
            </Section>

            <div id="download" className="relative h-[34rem]">
                <Galaxy3D colors={[ACCENT, '#c4b5fd', '#f0abfc']}>
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <h2 className="text-[clamp(2rem,5vw,4rem)] font-black leading-none tracking-tight">Free on the App Store</h2>
                        <p className="mt-3 text-white/70">Lumen Plus unlocks widgets and themes.</p>
                        <div className="mt-8">
                            <MagneticButton accentColor={ACCENT}>Download Lumen</MagneticButton>
                        </div>
                    </div>
                </Galaxy3D>
            </div>

            <Footer brand="Lumen" note="© Lumen Labs · Privacy · Terms" />
        </div>
    );
}
