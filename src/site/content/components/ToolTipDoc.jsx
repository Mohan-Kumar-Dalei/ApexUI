import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ToolTip from '../../../components/MainUI/ApexUI-Kit/ToolTip/ToolTip.jsx';

const people = [
    { id: 1, name: 'Captain America', designation: 'Leader of the Avengers', image: '/assets/captainamerica.png' },
    { id: 2, name: 'Doctor Strange', designation: 'Sorcerer Supreme', image: '/assets/doctorStrange.png' },
    { id: 3, name: 'Iron Man', designation: 'Leader Of Stark Industries', image: '/assets/ironman.png' },
    { id: 4, name: 'HULK', designation: 'Scientist', image: '/assets/hulk.png' },
    { id: 5, name: 'Spider-Man', designation: 'Friendly Neighborhood Spider-Man', image: '/assets/spiderman.png' },
    { id: 6, name: 'Thanos', designation: 'The Mad Titan', image: '/assets/thanos.png' },
];

const code = `import ToolTip from './ApexUI-Kit/ToolTip/ToolTip.jsx';

const people = [
  { id: 1, name: "Captain America", designation: "Leader of the Avengers", image: "/assets/captainamerica.png" },
  { id: 2, name: "Doctor Strange", designation: "Sorcerer Supreme", image: "/assets/doctorStrange.png" },
];

const App = () => (
  <div className="flex items-center justify-center h-screen bg-slate-950">
    <ToolTip items={people} />
  </div>
);

export default App;`;

const props = [
    { prop: 'items', type: 'array', def: '—', desc: 'People to show. Each item has id, name, designation and image.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'GSAP', desc: 'Professional-grade animation for the modern web.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid UI development.' },
];

export default function ToolTipDoc() {
    return (
        <ComponentDoc
            title="ToolTip"
            description="An animated tooltip that reveals details on hover — perfect for avatars, teams and galleries."
            preview={<ToolTip items={people} />}
            code={code}
            cli="tooltip"
            props={props}
            dependencies={dependencies}
        />
    );
}
