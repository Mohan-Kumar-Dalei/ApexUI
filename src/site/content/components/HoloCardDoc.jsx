import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import HoloCard from '../../../components/MainUI/ApexUI-Kit/HoloCard/HoloCard.jsx';

const props = [
    { prop: 'image', type: 'string', def: 'Doctor Strange', desc: 'Card artwork.' },
    { prop: 'title / subtitle', type: 'string', def: 'demo text', desc: 'Name and line under it.' },
    { prop: 'badge', type: 'string', def: '"Legendary"', desc: 'Pill in the top-left corner.' },
    { prop: 'stat', type: 'string', def: '"98"', desc: 'Number in the top-right badge.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Badge color.' },
    { prop: 'maxTilt', type: 'number', def: '16', desc: 'Strongest tilt in degrees.' },
    { prop: 'width', type: 'number', def: '17', desc: 'Card width in rem (never wider than 80vw).' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring-smoothed tilt, foil and glare.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function HoloCardDoc() {
    const [tilt, setTilt] = useState(16);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Holo Card"
            description="A collectible-style card that tilts in 3D, a rainbow foil and glare follow the light, and the title and badges float above the art."
            preview={<HoloCard maxTilt={tilt} accentColor={accent} />}
            controls={
                <ControlGrid>
                    <RangeControl label="Max tilt" value={tilt} onChange={setTilt} min={4} max={30} step={1} format={(v) => `${v}°`} />
                    <ColorControl label="Badge" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import HoloCard from './ApexUI-Kit/HoloCard/HoloCard.jsx';

const App = () => (
  <HoloCard
    image="/cards/hero.png"
    title="Doctor Strange"
    subtitle="Sorcerer Supreme"
    badge="Legendary"
    stat="98"
    maxTilt={${tilt}}
    accentColor="${accent}"
  />
);

export default App;`}
            cli="holo-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
