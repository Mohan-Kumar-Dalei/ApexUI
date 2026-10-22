import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import BounceCards from '../../../components/MainUI/ApexUI-Kit/BounceCards/BounceCards.jsx';

const props = [
    { prop: 'images', type: "string[]", def: "5 demo heroes", desc: "Card images." },
    { prop: 'cardSize', type: "number", def: "9", desc: "Card size in rem." },
    { prop: 'spread', type: "number", def: "5.5", desc: "Horizontal gap in rem." },
    { prop: 'fan', type: "number", def: "8", desc: "Rotation step in degrees." },
    { prop: 'delay', type: "number", def: "0.2", desc: "Delay before bouncing in, in seconds." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Bounce-in and hover springs.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function BounceCardsDoc() {
    const [fan, setFan] = useState(8);
    const [spread, setSpread] = useState(5.5);
    return (
        <ComponentDoc
            title="Bounce Cards"
            description="A hand of photo cards that bounce into a fan on load. Hover one and it straightens and lifts while its neighbours lean away to make room."
            preview={
                <BounceCards fan={fan} spread={spread} />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Fan" value={fan} onChange={setFan} min={0} max={18} step={1} format={(v) => `${v}°`} />
                    <RangeControl label="Spread" value={spread} onChange={setSpread} min={3} max={8} step={0.5} format={(v) => `${v}rem`} />
                </ControlGrid>
            }
            code={`import BounceCards from './ApexUI-Kit/BounceCards/BounceCards.jsx';

const App = () => (
  <div>
    <BounceCards
      fan={${fan}}
      spread={${spread}}
      images={["/one.jpg", "/two.jpg", "/three.jpg", "/four.jpg", "/five.jpg"]}
    />
  </div>
);

export default App;`}
            cli="bounce-cards"
            props={props}
            dependencies={dependencies}
        />
    );
}
