import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import CardFan from '../../../components/MainUI/ApexUI-Kit/CardFan/CardFan.jsx';

const props = [
    { prop: 'items', type: '{ title, image, price?, color, textColor?, alt?, id? }[]', def: 'seven Avengers', desc: 'One card per item, in its own colour. Text turns light or dark to suit the colour unless you set textColor.' },
    { prop: 'cardWidth', type: 'number', def: '16.9', desc: 'Largest card width in rem. Cards shrink to fit the container.' },
    { prop: 'minCardWidth', type: 'number', def: '8.5', desc: 'Below this width (rem) the fan becomes a straight row you swipe.' },
    { prop: 'spread', type: 'number', def: '5', desc: 'Degrees each card turns away from the middle.' },
    { prop: 'curve', type: 'number', def: '0.44', desc: 'How far the outer cards drop, in rem per step squared.' },
    { prop: 'tilt', type: 'number', def: '14', desc: 'Degrees a card tilts toward the pointer.' },
    { prop: 'onAdd', type: '(item, index) => void', def: 'none', desc: 'Shows the plus button; called when it is pressed. The plus turns into a tick for a moment.' },
    { prop: 'onLike', type: '(item, index) => void', def: 'none', desc: 'Shows the heart button; called when it is pressed.' },
    { prop: 'liked', type: '(string)[]', def: '[]', desc: 'ids (or titles) of the cards whose heart is filled.' },
    { prop: 'likeLabel', type: 'string', def: '"your list"', desc: 'Used in the heart button label, for example "your wishlist".' },
    { prop: 'className', type: 'string', def: '""', desc: 'Classes for the outer element.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'The tilt, lift and press.' },
    { name: 'Lucide React', desc: 'Heart, plus and tick icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CardFanDoc() {
    const [spread, setSpread] = useState(5);
    const [curve, setCurve] = useState(0.44);
    const [tilt, setTilt] = useState(14);
    const [liked, setLiked] = useState(['Spider-Man']);

    const code = `import { useState } from 'react';
import CardFan from './ApexUI-Kit/CardFan/CardFan.jsx';

const heroes = [
  { id: "ironman", title: "Iron Man", image: "/ironman.png", price: "₹2,499", color: "#A3141E" },
  { id: "cap", title: "Captain America", image: "/captainamerica.png", price: "₹2,299", color: "#24317A" },
  { id: "hulk", title: "Hulk", image: "/hulk.png", price: "₹2,799", color: "#3E7B27" },
  { id: "strange", title: "Doctor Strange", image: "/doctorStrange.png", price: "₹2,399", color: "#E3A21A" },
];

const App = () => {
  const [liked, setLiked] = useState([]);
  return (
    <CardFan
      items={heroes}
      spread={${spread}}
      curve={${curve}}
      tilt={${tilt}}
      liked={liked}
      onLike={(item) => setLiked((l) => (l.includes(item.id) ? l.filter((x) => x !== item.id) : [...l, item.id]))}
      onAdd={(item) => console.log("add", item.id)}
    />
  );
};

export default App;`;

    return (
        <ComponentDoc
            title="Card Fan"
            description="A hand of tall product cards in their own colours, fanned on a curve. Each card tilts toward the pointer and presses in, with a heart and a plus. It shrinks to fit, and turns into a swipe row on phones."
            previewClassName="!px-0"
            preview={
                <div className="w-full" style={{ fontFamily: 'Georgia, serif' }}>
                    <CardFan
                        spread={spread}
                        curve={curve}
                        tilt={tilt}
                        liked={liked}
                        onLike={(it) => setLiked((l) => (l.includes(it.title) ? l.filter((x) => x !== it.title) : [...l, it.title]))}
                        onAdd={() => {}}
                    />
                </div>
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Spread" value={spread} onChange={setSpread} min={0} max={10} step={0.5} format={(v) => `${v}°`} />
                    <RangeControl label="Curve" value={curve} onChange={setCurve} min={0} max={1.2} step={0.04} format={(v) => `${v.toFixed(2)}rem`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={0} max={24} format={(v) => `${v}°`} />
                </ControlGrid>
            }
            code={code}
            cli="card-fan"
            props={props}
            dependencies={dependencies}
        />
    );
}
