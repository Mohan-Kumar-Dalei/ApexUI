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
        <div ref={scrollRef} className="scrollbar-hide relative h-[520px] w-full overflow-y-auto">
            <div className="flex h-[1100px] w-full flex-col items-center justify-between py-24">
                <p className="text-4xl font-semibold text-white/25 sm:text-5xl">Scroll down ↓</p>
                <div className="w-full">
                    <ScrollMarquee scrollRef={scrollRef} />
                </div>
                <p className="text-4xl font-semibold text-white/25 sm:text-5xl">Now scroll up ↑</p>
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
