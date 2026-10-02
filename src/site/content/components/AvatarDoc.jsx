import ComponentDoc from '../../docs/ComponentDoc.jsx';
import Avatar from '../../../components/MainUI/ApexUI-Kit/Avatar/Avatar.jsx';

const users = [
    { name: 'Iron Man', imageUrl: '/assets/ironman.png', color: '#6366f1' },
    { name: 'Spider Man', imageUrl: '/assets/spiderman.png', color: '#ec4899' },
    { name: 'HULK', imageUrl: '/assets/hulk.png', color: '#22c55e' },
    { name: 'Doc Strange', imageUrl: '/assets/doctorStrange.png', color: '#f97316' },
    { name: 'Captain', imageUrl: '/assets/captainamerica.png', color: '#06b6d4' },
];

const code = `import Avatar from './ApexUI-Kit/Avatar/Avatar.jsx';

const users = [
  { name: "Iron Man", imageUrl: "/assets/ironman.png", color: "#6366f1" },
  { name: "Spider Man", imageUrl: "/assets/spiderman.png", color: "#ec4899" },
  { name: "HULK", imageUrl: "/assets/hulk.png", color: "#22c55e" },
  { name: "Doc Strange", imageUrl: "/assets/doctorStrange.png", color: "#f97316" },
  { name: "Captain", imageUrl: "/assets/captainamerica.png", color: "#06b6d4" },
];

const App = () => <Avatar users={users} />;

export default App;`;

const props = [
    { prop: 'users', type: 'array', def: '[]', desc: 'Avatars to show. Each item has a name, imageUrl and accent color.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
];

export default function AvatarDoc() {
    return (
        <ComponentDoc
            title="Avatar"
            description="A clean component for user avatars, with support for animated, stacked groups."
            preview={<Avatar users={users} />}
            code={code}
            cli="avatar"
            props={props}
            dependencies={dependencies}
        />
    );
}
