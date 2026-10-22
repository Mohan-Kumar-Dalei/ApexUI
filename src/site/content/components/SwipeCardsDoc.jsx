import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import SwipeCards from '../../../components/MainUI/ApexUI-Kit/SwipeCards/SwipeCards.jsx';

const props = [
    { prop: 'cards', type: '{ image, title, subtitle? }[]', def: '5 demo heroes', desc: 'Cards in the deck (it loops when it runs out).' },
    { prop: 'threshold', type: 'number', def: '110', desc: 'Drag distance in px that counts as a swipe.' },
    { prop: 'likeColor', type: 'string', def: '"#a3e635"', desc: 'LIKE stamp and button color.' },
    { prop: 'nopeColor', type: 'string', def: '"#f43f5e"', desc: 'NOPE stamp and button color.' },
    { prop: 'onSwipe', type: "(card, 'left' | 'right') => void", def: '—', desc: 'Called after every swipe.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Drag, tilt, stamps and fly-off.' },
    { name: 'Lucide React', desc: 'Button icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function SwipeCardsDoc() {
    const [threshold, setThreshold] = useState(110);
    const [like, setLike] = useState('#a3e635');
    const [last, setLast] = useState('');

    const code = `import SwipeCards from './ApexUI-Kit/SwipeCards/SwipeCards.jsx';

const cards = [
  { image: "/people/ana.jpg", title: "Ana", subtitle: "2 km away" },
  { image: "/people/leo.jpg", title: "Leo", subtitle: "5 km away" },
];

const App = () => (
  <SwipeCards
    cards={cards}
    threshold={${threshold}}
    likeColor="${like}"
    onSwipe={(card, dir) => console.log(card.title, dir)}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Swipe Cards"
            description="A deck you swipe left or right — the card tilts with your drag, flashes a LIKE or NOPE stamp and flies off. Buttons, undo and arrow keys included."
            preview={
                <div className="flex flex-col items-center py-4 text-[var(--ink)]">
                    <SwipeCards threshold={threshold} likeColor={like} onSwipe={(card, dir) => setLast(`${card.title} → ${dir === 'right' ? 'liked' : 'passed'}`)} />
                    <p className="mt-4 h-5 font-mono text-xs text-[var(--ink-3)]">{last}</p>
                </div>
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Swipe distance" value={threshold} onChange={setThreshold} min={50} max={220} step={10} format={(v) => `${v}px`} />
                    <ColorControl label="Like color" value={like} onChange={setLike} />
                </ControlGrid>
            }
            code={code}
            cli="swipe-cards"
            props={props}
            dependencies={dependencies}
        />
    );
}
