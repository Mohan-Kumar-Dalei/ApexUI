import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import CardFan from '../../../components/MainUI/ApexUI-Kit/CardFan/CardFan.jsx';

const props = [
    { prop: 'items', type: '{ title, image, price?, color, textColor?, alt?, id? }[]', def: 'seven Avengers', desc: 'One card per item, in its own colour. Text turns light or dark to suit the colour unless you set textColor.' },
    { prop: 'cardWidth', type: 'number', def: '16.9', desc: 'Largest card width in rem. Cards shrink to fit the container.' },
    { prop: 'minCardWidth', type: 'number', def: '8.5', desc: 'Smallest card width in rem. In a tight space the cards overlap more first; below this the fan becomes a straight row you swipe.' },
    { prop: 'fan', type: 'number', def: '5', desc: 'Degrees each card turns away from the middle. 0 keeps them upright.' },
    { prop: 'spread', type: 'number', def: '0.88', desc: 'How far apart the cards sit, as a share of a card width: 1 is edge to edge, lower overlaps, higher leaves a gap.' },
    { prop: 'curve', type: 'number', def: '0.44', desc: 'How far the outer cards drop, in rem per step squared.' },
    { prop: 'tilt', type: 'number', def: '16', desc: 'Degrees a card leans toward the mouse when you hover it. 0 turns it off.' },
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
    const [fan, setFan] = useState(5);
    const [spread, setSpread] = useState(0.88);
    const [curve, setCurve] = useState(0.44);
    const [tilt, setTilt] = useState(16);
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
      fan={${fan}}
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
            description="A hand of tall product cards in their own colours, fanned on a curve. Hover a card and it lifts and leans toward the mouse; press it and it sinks in. Each has a heart and a plus. It shrinks to fit, and turns into a swipe row on phones."
            previewClassName="!px-0"
            preview={
                <div className="w-full" style={{ fontFamily: 'Georgia, serif' }}>
                    <CardFan
                        fan={fan}
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
                    <RangeControl label="Fan" value={fan} onChange={setFan} min={0} max={12} step={0.5} format={(v) => `${v}°`} />
                    <RangeControl label="Spread" value={spread} onChange={setSpread} min={0.55} max={1.15} step={0.01} format={(v) => v.toFixed(2)} />
                    <RangeControl label="Curve" value={curve} onChange={setCurve} min={0} max={1.2} step={0.04} format={(v) => `${v.toFixed(2)}rem`} />
                    <RangeControl label="Hover tilt" value={tilt} onChange={setTilt} min={0} max={30} format={(v) => `${v}°`} />
                </ControlGrid>
            }
            code={code}
            cli="card-fan"
            props={props}
            dependencies={dependencies}
        />
    );
}
