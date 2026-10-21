import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { withCdn } from '../../ui/cdn.js';
import NavDropDown from '../../../components/MainUI/ApexUI-Kit/NavDropDown/NavDropDown.jsx';

const navigationData = withCdn([
    {
        label: 'Features',
        type: 'services',
        submenu: [
            { label: 'AI Copilot', subtitle: 'Boost your productivity.', href: '#' },
            { label: 'Code Analytics', subtitle: 'In-depth project insights.', href: '#' },
            { label: 'Team Collaboration', subtitle: 'Work together seamlessly.', href: '#' },
            { label: 'Cloud Deployment', subtitle: 'Deploy with a single click.', href: '#' },
        ],
    },
    {
        label: 'Solutions',
        type: 'products',
        submenu: [
            { label: 'Spider Man', href: '#', image: '/assets/spiderman.png', subtitle: 'Friendly Neighborhood Spider Man' },
            { label: 'Iron Man', href: '#', image: '/assets/ironman.png', subtitle: 'I am Iron Man' },
            { label: 'Captain America', href: '#', image: '/assets/captainamerica.png', subtitle: 'Leader Of Avengers' },
            { label: 'Hulk', href: '#', image: '/assets/hulk.png', subtitle: 'Hulk Smash' },
        ],
    },
    {
        label: 'Resources',
        type: 'links',
        submenu: [
            { label: 'Documentation', href: '#' },
            { label: 'API Reference', href: '#' },
            { label: 'Case Studies', href: '#' },
            { label: 'Community Forum', href: '#' },
        ],
    },
    { label: 'Pricing', href: '#' },
], { w: 200 });

const code = `import NavDropDown from './ApexUI-Kit/NavDropDown/NavDropDown.jsx';

const navigationData = [
  {
    label: "Features",
    type: "services", // "services" | "products" | "links"
    submenu: [
      { label: "AI Copilot", subtitle: "Boost your productivity.", href: "#" },
      { label: "Code Analytics", subtitle: "In-depth project insights.", href: "#" },
    ],
  },
  {
    label: "Solutions",
    type: "products",
    submenu: [
      { label: "Spider Man", href: "#", image: "/assets/spiderman.png", subtitle: "Friendly Neighborhood Spider Man" },
      { label: "Iron Man", href: "#", image: "/assets/ironman.png", subtitle: "I am Iron Man" },
    ],
  },
  {
    label: "Resources",
    type: "links",
    submenu: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
    ],
  },
  { label: "Pricing", href: "#" },
];

// Pin it to the top of the page with className, e.g. "fixed top-4 left-1/2 -translate-x-1/2".
const App = () => <NavDropDown navData={navigationData} />;

export default App;`;

const props = [
    { prop: 'navData', type: 'array', def: '[...]', desc: 'Menu items: label, href, and an optional type ("services", "products", "links") with a submenu. Service items accept an optional icon component.' },
    { prop: 'className', type: 'string', def: "''", desc: 'Extra classes for the wrapper, e.g. to make it fixed at the top of the page.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animates the shared panel, the hover highlight and the sliding content.' },
    { name: 'Lucide React', desc: 'Chevron and arrow icons.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function NavDropDownDoc() {
    return (
        <ComponentDoc
            title="Nav DropDown"
            description="A floating pill navbar with one shared dropdown that morphs between menus. Works with mouse, touch and keyboard."
            preview={<NavDropDown navData={navigationData} />}
            previewClassName="!items-start min-h-[520px]"
            code={code}
            cli="nav-dropdown"
            props={props}
            dependencies={dependencies}
        />
    );
}
