import ImageAccordion from '../../components/MainUI/ApexUI-Kit/ImageAccordion/ImageAccordion.jsx';
import InfiniteCanvas from '../../components/MainUI/ApexUI-Kit/InfiniteCanvas/InfiniteCanvas.jsx';
import ScrollStack, { ScrollStackItem } from '../../components/MainUI/ApexUI-Kit/ScrollStack/ScrollStack.jsx';
import ArcGallery from '../../components/MainUI/ApexUI-Kit/ArcGallery/ArcGallery.jsx';
import BlurRevealText from '../../components/MainUI/ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#fdba74';

const DESTINATIONS = [
    { image: photo('photo-1464822759023-fed622ff2c3b', 1400), title: 'Swiss Alps', description: 'Ridgelines at first light, 12 days on foot.' },
    { image: photo('photo-1470770841072-f978cf4d019e', 1400), title: 'Dolomites', description: 'Mirror lakes and a lot of patience.' },
    { image: photo('photo-1505144808419-1957a94ca61e', 1400), title: 'Algarve', description: 'Sea caves, golden hour, salt in the lens.' },
    { image: photo('photo-1441974231531-c6227db76b6e', 1400), title: 'Black Forest', description: 'Fog days and very quiet mornings.' },
    { image: photo('photo-1477959858617-67f85cf4f1df', 1400), title: 'New York', description: 'Rooftops after the rain.' },
];

const WALL = [
    'photo-1506905925346-21bda4d32df4',
    'photo-1469474968028-56623f02e42e',
    'photo-1501785888041-af3ef285b470',
    'photo-1493246507139-91e8fad9978e',
    'photo-1518837695005-2083093ee35b',
    'photo-1433086966358-54859d0ed716',
    'photo-1476514525535-07fb3b4ae5f1',
    'photo-1500964757637-c85e8a162699',
    'photo-1511300636408-a63a89df3482',
    'photo-1449824913935-59a10b8d2000',
    'photo-1480714378408-67cf0d13bc1b',
    'photo-1500530855697-b586d89ba3ee',
].map((id, i) => ({ image: photo(id, 600), title: ['Patagonia', 'Lake Bled', 'Moraine', 'Glencoe', 'Big Sur', 'Iceland', 'Santorini', 'Kyoto', 'Faroe', 'Tokyo', 'Paris', 'Yosemite'][i] }));

const STEPS = [
    ['01', 'Scout', 'We study maps, weather and light for weeks before a single shot.', 'photo-1500530855697-b586d89ba3ee'],
    ['02', 'Shoot', 'Small crew, long days, and waiting for the moment the light turns.', 'photo-1506905925346-21bda4d32df4'],
    ['03', 'Edit', 'Colour graded by hand, so every frame feels like the place did.', 'photo-1513542789411-b6a5d4f31634'],
    ['04', 'Print', 'Museum grade paper, signed and shipped flat to your door.', 'photo-1469474968028-56623f02e42e'],
];

const PRINTS = ['photo-1470770841072-f978cf4d019e', 'photo-1464822759023-fed622ff2c3b', 'photo-1505144808419-1957a94ca61e', 'photo-1441974231531-c6227db76b6e', 'photo-1493246507139-91e8fad9978e', 'photo-1518837695005-2083093ee35b', 'photo-1433086966358-54859d0ed716'].map((id, i) => ({
    image: photo(id, 800),
    text: ['Dolomites No. 4', 'Alpine Ridge', 'Ponta da Piedade', 'Forest Fog', 'Blue Hour', 'Pacific', 'Skógafoss'][i],
}));

/* Atlas: a travel photography studio. */
export default function AtlasTemplate() {
    return (
        <div className="bg-[#0d0b0a] text-white">
            <div className="relative h-[min(100svh,50rem)] min-h-[36rem] overflow-hidden">
                <TemplateHeader brand="Atlas" links={['Journeys', 'Prints', 'Studio']} cta="Book a trip" accent={ACCENT} />
                <img src={photo('photo-1464822759023-fed622ff2c3b', 2200)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#0d0b0a]" />
                <div className="relative flex h-full flex-col justify-end px-[clamp(1rem,4vw,3rem)] pb-[clamp(3rem,8vw,6rem)]">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/70">Travel photography · Since 2014</p>
                    <BlurRevealText as="h1" text="Places worth getting up early for" highlight={['early']} accentColor={ACCENT} className="mt-3 max-w-4xl text-[clamp(2.4rem,7vw,6rem)] font-black leading-[0.95] tracking-tight" />
                    <div className="mt-8 flex flex-wrap gap-3">
                        <MagneticButton accentColor={ACCENT}>See the journeys</MagneticButton>
                        <span className="inline-flex h-12 items-center self-center rounded-full border border-white/25 bg-black/20 px-6 text-sm font-semibold backdrop-blur">Shop prints</span>
                    </div>
                </div>
            </div>

            <Section eyebrow="Destinations" title="Where we went this year" text="Hover a place to open it.">
                <div className="mx-auto max-w-6xl">
                    <ImageAccordion items={DESTINATIONS} height="28rem" />
                </div>
            </Section>

            <Section eyebrow="The archive" title="Ten years of frames" text="Drag the wall in any direction." className="!pt-0">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10">
                    <InfiniteCanvas items={WALL} cardWidth={13} height="34rem" />
                </div>
            </Section>

            {/* A real page-scroll stack: the cards pin under the top as you scroll down. */}
            <section className="px-[clamp(1rem,4vw,3rem)] pt-[clamp(2rem,5vw,4rem)]">
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">How we work</p>
                    <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">From map to wall</h2>
                </div>
                <ScrollStack useWindowScroll top={150} offset={26} gap={120} endSpace={120} dim={0.3}>
                    {STEPS.map(([n, title, body, id]) => (
                        <ScrollStackItem key={n} className="mx-auto !h-[min(26rem,70vh)] max-w-4xl !p-0">
                            <div className="grid h-full md:grid-cols-2">
                                <img src={photo(id, 1000)} alt="" loading="lazy" className="h-40 w-full object-cover md:h-full" />
                                <div className="flex flex-col justify-between bg-[#1b1714] p-[clamp(1.25rem,3vw,2.25rem)]">
                                    <span className="font-mono text-sm" style={{ color: ACCENT }}>
                                        {n} / 04
                                    </span>
                                    <div>
                                        <h3 className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight">{title}</h3>
                                        <p className="mt-2 max-w-sm text-sm text-white/70">{body}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </section>

            <Section eyebrow="Prints" title="Take a place home" text="Drag or scroll the row." className="!px-0">
                <ArcGallery items={PRINTS} height="26rem" />
            </Section>

            <Footer brand="Atlas Studio" note="hello@atlas.studio · Lisbon and on the road" />
        </div>
    );
}
