import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import PixelTransition from '../../../components/MainUI/ApexUI-Kit/PixelTransition/PixelTransition.jsx';

const props = [
    { prop: 'first', type: "ReactNode", def: "hero image", desc: "Content shown at rest." },
    { prop: 'second', type: "ReactNode", def: "hero bio", desc: "Content revealed on hover." },
    { prop: 'gridSize', type: "number", def: "10", desc: "Pixels per side." },
    { prop: 'pixelColor', type: "string", def: "\"#a3e635\"", desc: "Pixel color." },
    { prop: 'duration', type: "number", def: "0.45", desc: "Total transition time in seconds." },
    { prop: 'aspectRatio', type: "string", def: "\"4 / 5\"", desc: "Card shape." },
    { prop: 'width', type: "number", def: "16", desc: "Card width in rem." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function PixelTransitionDoc() {
    const [grid, setGrid] = useState(10);
    const [color, setColor] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Pixel Transition"
            description="Hover (or tap) the card and it dissolves into a grid of pixels that pop in at random, the content swaps underneath, then the pixels clear away to reveal the second side."
            preview={
                <PixelTransition gridSize={grid} pixelColor={color} />
            }
            controls={
                <ControlGrid>
                    <RangeControl label="Grid" value={grid} onChange={setGrid} min={4} max={24} step={1} format={(v) => `${v}×${v}`} />
                    <ColorControl label="Pixels" value={color} onChange={setColor} />
                </ControlGrid>
            }
            code={`import PixelTransition from './ApexUI-Kit/PixelTransition/PixelTransition.jsx';

const App = () => (
  <div>
    <PixelTransition
      gridSize={${grid}}
      pixelColor="${color}"
      first={<img src="/cover.jpg" alt="" className="h-full w-full object-cover" />}
      second={<div className="grid h-full place-items-center bg-black text-white">Hello 👋</div>}
    />
  </div>
);

export default App;`}
            cli="pixel-transition"
            props={props}
            dependencies={dependencies}
        />
    );
}
