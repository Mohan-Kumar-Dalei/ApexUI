import ComponentDoc from '../../docs/ComponentDoc.jsx';
import PointerFollower from '../../../components/MainUI/ApexUI-Kit/PointerFollower/PointerFollower.jsx';

const code = `import PointerFollower from './ApexUI-Kit/PointerFollower/PointerFollower.jsx';

const people = [
  { id: 1, name: "Captain America", job: "Leader of the Avengers", img: "/assets/captainamerica.png" },
  { id: 2, name: "Doctor Strange", job: "Sorcerer Supreme", img: "/assets/doctorStrange.png" },
  { id: 3, name: "Iron Man", job: "Leader Of Stark Industries", img: "/assets/ironman.png" },
];

const App = () => (
  <PointerFollower
    people={people}
    cursorColor="#fff"
    interval={3000}
    badgeColor="#fff"
    badgeTextColor="#212121"
  />
);

export default App;`;

const props = [
    { prop: 'people', type: 'array', def: 'built-in list', desc: 'People to cycle through. Each item has id, name, job and img.' },
    { prop: 'cursorColor', type: 'string', def: '"#fff"', desc: 'Custom cursor color (SVG fill).' },
    { prop: 'interval', type: 'number', def: '3000', desc: 'Image change interval in ms.' },
    { prop: 'badgeColor', type: 'string', def: '"#fff"', desc: 'Background color of the name/job badge.' },
    { prop: 'badgeTextColor', type: 'string', def: '"#212121"', desc: 'Text color of the name/job badge.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function PointerFollowerDoc() {
    return (
        <ComponentDoc
            title="Pointer Follower"
            description="A custom pointer that follows the cursor and reveals people, images and details as it moves."
            preview={
                <div className="flex w-full flex-col items-center justify-evenly gap-10">
                    <PointerFollower cursorColor="#a3e635" badgeColor="#a3e635" badgeTextColor="#0a0a0a" />
                    <p className="text-lg font-medium text-zinc-500">Move your cursor</p>
                </div>
            }
            code={code}
            cli="pointer-follower"
            props={props}
            dependencies={dependencies}
        />
    );
}
