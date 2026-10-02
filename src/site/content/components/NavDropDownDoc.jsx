import ComponentDoc from '../../docs/ComponentDoc.jsx';
import NavDropDown from '../../../components/MainUI/ApexUI-Kit/NavDropDown/NavDropDown.jsx';

const navigationData = [
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
];

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

const App = () => <NavDropDown navData={navigationData} />;

export default App;`;

const props = [
    { prop: 'navData', type: 'array', def: '[]', desc: 'Menu items: label, href, and an optional type ("services", "products", "links") with a submenu.' },
    { prop: 'fixed', type: 'boolean', def: 'false', desc: 'Pin the menu to the top centre of the viewport.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animation library for smooth dropdown effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function NavDropDownDoc() {
    return (
        <ComponentDoc
            title="Nav DropDown"
            description="A clean, accessible dropdown menu for navigation bars, powered by smooth animations."
            preview={<NavDropDown navData={navigationData} />}
            previewClassName="!items-start min-h-[520px]"
            code={code}
            cli="nav-dropdown"
            props={props}
            dependencies={dependencies}
        />
    );
}
