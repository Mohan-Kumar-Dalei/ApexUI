import { useRef } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ScrollMarquee from '../../../components/MainUI/ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';

const code = `import { useRef } from 'react';
import ScrollMarquee from './ApexUI-Kit/ScrollMarquee/ScrollMarquee.jsx';

const App = () => {
  const scrollContainerRef = useRef(null);
  return (
    <div ref={scrollContainerRef} style={{ height: '100vh', overflowY: 'scroll' }}>
      {/* Add enough content to make the container scrollable */}
      <div style={{ height: '200vh' }}>
        <ScrollMarquee scrollRef={scrollContainerRef} />
      </div>
    </div>
  );
};

export default App;`;

const props = [
    { prop: 'items', type: 'string[]', def: '["Apex UI", ...]', desc: 'Strings for the marquee lines.' },
    { prop: 'speed', type: 'number', def: '50', desc: 'Base speed of the marquee.' },
    { prop: 'direction', type: 'string', def: 'undefined', desc: 'Global direction for all lines.' },
    { prop: 'repeat', type: 'number', def: '10', desc: 'Number of repeated text copies per line.' },
    { prop: 'textStroke', type: 'boolean', def: 'true', desc: 'Outline the hovered word with textStrokeColor.' },
    { prop: 'textStrokeColor', type: 'string', def: "'#C27AFF'", desc: 'Color of the text stroke on hover.' },
    { prop: 'textFillColor', type: 'string', def: "'#1E2637'", desc: 'Fill color of the text on hover.' },
    { prop: 'textColor', type: 'string', def: "'#fff'", desc: 'Default text color.' },
    { prop: 'scrollRef', type: 'RefObject', def: 'undefined', desc: 'Ref to a custom scroll container (defaults to the window).' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

function Preview() {
    const scrollRef = useRef(null);
    return (
        <div ref={scrollRef} className="scrollbar-hide absolute inset-0 overflow-y-auto overscroll-contain">
            <div className="flex min-h-[260%] w-full flex-col items-center gap-[clamp(2.5rem,8vh,6rem)] pb-[60%] pt-[clamp(2rem,7vh,5rem)]">
                <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-white/40">Scroll inside this box ↕</p>
                <div className="w-full">
                    <ScrollMarquee scrollRef={scrollRef} />
                </div>
                <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-white/30">Now scroll back up ↑</p>
            </div>
        </div>
    );
}

export default function ScrollMarqueeDoc() {
    return (
        <ComponentDoc
            title="Scroll Marquee"
            description="A text marquee whose speed and direction follow the scroll velocity."
            preview={<Preview />}
            fullBleed
            code={code}
            cli="scroll-marquee"
            props={props}
            dependencies={dependencies}
        />
    );
}
