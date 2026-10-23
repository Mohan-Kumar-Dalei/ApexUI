import { Clock, MapPin, Phone } from 'lucide-react';
import ImageAccordion from '../../components/MainUI/ApexUI-Kit/ImageAccordion/ImageAccordion.jsx';
import ArcGallery from '../../components/MainUI/ApexUI-Kit/ArcGallery/ArcGallery.jsx';
import ReceiptPrinter from '../../components/MainUI/ApexUI-Kit/ReceiptPrinter/ReceiptPrinter.jsx';
import Stepper from '../../components/MainUI/ApexUI-Kit/Stepper/Stepper.jsx';
import BlurRevealText from '../../components/MainUI/ApexUI-Kit/BlurRevealText/BlurRevealText.jsx';
import MagneticButton from '../../components/MainUI/ApexUI-Kit/MagneticButton/MagneticButton.jsx';
import { Footer, Section, TemplateHeader } from './parts.jsx';
import { photo } from './photos.js';

const ACCENT = '#f5b041';

const MENU = [
    { image: photo('photo-1555939594-58d7cb561ad1', 1300), title: 'From the grill', description: 'Charred over oak, finished with smoked salt and herbs.' },
    { image: photo('photo-1540189549336-e6e99c3679fe', 1300), title: 'Garden', description: 'Whatever the farm sent this morning, barely dressed.' },
    { image: photo('photo-1565299624946-b28f40a0ae38', 1300), title: 'Wood oven', description: 'Long proofed dough, blistered at 450 °C.' },
    { image: photo('photo-1600891964092-4316c288032e', 1300), title: 'Signatures', description: 'The plates people book a table for.' },
    { image: photo('photo-1567620905732-2d1ec7ab7445', 1300), title: 'Brunch', description: 'Weekends from 10, until the batter runs out.' },
];

const DISHES = [
    ['photo-1504674900247-0877df9cc836', 'Ember beef, chimichurri'],
    ['photo-1546069901-ba9599a7e63c', 'Market bowl'],
    ['photo-1512621776951-a57141f2eefd', 'Green goddess salad'],
    ['photo-1565299624946-b28f40a0ae38', 'Saffron margherita'],
    ['photo-1567620905732-2d1ec7ab7445', 'Brown butter stack'],
    ['photo-1555939594-58d7cb561ad1', 'Fire grilled skewers'],
    ['photo-1600891964092-4316c288032e', 'Dry aged ribeye'],
].map(([id, text]) => ({ image: photo(id, 700), text }));

const ORDER = [
    { name: 'Ember beef', qty: 1, price: 28 },
    { name: 'Saffron margherita', qty: 1, price: 16 },
    { name: 'Market bowl', qty: 2, price: 14 },
    { name: 'House lemonade', qty: 2, price: 5 },
];

const BOOKING = [
    { title: 'Date', content: <p>Friday, 22 May · we have tables at 19:00, 19:30 and 21:15.</p> },
    { title: 'Guests', content: <p>Table for 4, by the window if you like.</p> },
    { title: 'Details', content: <p>Any allergies or a birthday? Tell us and the kitchen will plan for it.</p> },
];

/* Saffron: a modern grill restaurant. */
export default function SaffronTemplate() {
    return (
        <div className="bg-[#120d09] text-[#f6efe4]">
            <div className="relative h-[min(100svh,50rem)] min-h-[36rem] overflow-hidden">
                <TemplateHeader brand="Saffron" links={['Menu', 'Order', 'Book']} cta="Book a table" accent={ACCENT} />
                <img src={photo('photo-1517248135467-4c7edcad34c4', 2200)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-[#120d09]" />
                <div className="relative flex h-full flex-col items-center justify-center px-6 pt-10 text-center">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-white/75">Wood fire · Since 2016</p>
                    <BlurRevealText as="h1" text="Cooked over fire, shared at the table" highlight={['fire,']} accentColor={ACCENT} className="mt-4 max-w-4xl text-[clamp(2.4rem,7vw,5.6rem)] font-black leading-[0.95] tracking-tight" />
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <MagneticButton accentColor={ACCENT}>Book a table</MagneticButton>
                        <span className="inline-flex items-center rounded-full border border-white/25 bg-black/25 px-6 text-sm font-semibold backdrop-blur">See the menu</span>
                    </div>
                </div>
            </div>

            <div className="grid border-y border-white/10 text-sm sm:grid-cols-3">
                {[
                    [Clock, 'Tue to Sun · 12:00 to 23:00'],
                    [MapPin, '14 Rua das Flores, Porto'],
                    [Phone, '+351 222 000 145'],
                ].map(([Icon, text]) => (
                    <p key={text} className="flex items-center justify-center gap-2 border-white/10 px-4 py-5 text-white/70 sm:[&:not(:last-child)]:border-r">
                        <Icon className="h-4 w-4" style={{ color: ACCENT }} /> {text}
                    </p>
                ))}
            </div>

            <Section eyebrow="The menu" title="Five ways to eat with us" text="Hover a section.">
                <div className="mx-auto max-w-6xl">
                    <ImageAccordion items={MENU} height="28rem" />
                </div>
            </Section>

            <Section eyebrow="Tonight" title="Off the pass" className="!px-0 !pt-0">
                <ArcGallery items={DISHES} height="26rem" autoScroll={45} />
            </Section>

            <Section className="border-t border-white/10">
                <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
                    <div>
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50">Order ahead</p>
                        <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black leading-[1.05] tracking-tight">Ready when you walk in</h2>
                        <p className="mt-4 text-white/65">Order on the way and your food leaves the oven as you arrive. The receipt prints itself.</p>
                    </div>
                    <div className="flex justify-center">
                        <ReceiptPrinter store="Saffron" address="14 Rua das Flores, Porto" items={ORDER} currency="€" taxRate={0.06} orderId="SF-1048" accentColor={ACCENT} />
                    </div>
                </div>
            </Section>

            <Section eyebrow="Reservations" title="Book a table in three steps">
                <div className="mx-auto max-w-2xl">
                    <Stepper steps={BOOKING} accentColor={ACCENT} theme="dark" />
                </div>
            </Section>

            <Footer brand="Saffron" note="Porto · Wood fire kitchen · Gift cards" />
        </div>
    );
}
