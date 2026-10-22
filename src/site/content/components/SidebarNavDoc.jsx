import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import SidebarNav from '../../../components/MainUI/ApexUI-Kit/SidebarNav/SidebarNav.jsx';

const props = [
    { prop: 'sections', type: '{ title, items: { id, label, icon?, badge?, children? }[] }[]', def: 'demo app menu', desc: 'Menu groups; an item with children opens and closes.' },
    { prop: 'brand', type: '{ name, logo? }', def: '{ name: "Apex" }', desc: 'Name and optional logo at the top.' },
    { prop: 'user', type: '{ name, email, avatar } | null', def: 'demo user', desc: 'Profile at the bottom; null hides it.' },
    { prop: 'defaultActive', type: 'string', def: '"home"', desc: 'Id of the item that starts active.' },
    { prop: 'defaultCollapsed', type: 'boolean', def: 'false', desc: 'Start as the icon rail.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Active marker, icon, badge and logo color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Panel colors.' },
    { prop: 'onSelect', type: '(item) => void', def: '—', desc: 'Called when an item is chosen.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the sidebar.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Width spring, sliding active pill and group height.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function SidebarNavDoc() {
    const [theme, setTheme] = useState('dark');
    const [accent, setAccent] = useState('#a3e635');
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('Dashboard');

    const code = `import { Home, Inbox, Settings } from 'lucide-react';
import SidebarNav from './ApexUI-Kit/SidebarNav/SidebarNav.jsx';

const sections = [
  {
    title: "Main",
    items: [
      { id: "home", label: "Dashboard", icon: Home },
      { id: "inbox", label: "Inbox", icon: Inbox, badge: 4 },
    ],
  },
  { title: "Other", items: [{ id: "settings", label: "Settings", icon: Settings }] },
];

const App = () => (
  <div className="flex h-screen">
    <SidebarNav
      sections={sections}
      theme="${theme}"
      accentColor="${accent}"${collapsed ? '\n      defaultCollapsed' : ''}
      onSelect={(item) => console.log(item.id)}
    />
    <main className="flex-1">...</main>
  </div>
);

export default App;`;

    const dark = theme === 'dark';

    return (
        <ComponentDoc
            title="Sidebar Nav"
            description="An app sidebar that collapses to an icon rail — a sliding active pill, opening groups, badges, rail tooltips and a profile footer."
            preview={
                <div className={`flex h-[30rem] w-full max-w-3xl overflow-visible rounded-2xl border ${dark ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-neutral-50'}`}>
                    <SidebarNav key={`${theme}-${collapsed}`} theme={theme} accentColor={accent} defaultCollapsed={collapsed} onSelect={(item) => setCurrent(item.label)} className="rounded-l-2xl" />
                    <div className={`flex-1 p-6 ${dark ? 'text-white' : 'text-neutral-900'}`}>
                        <p className="text-[0.75rem] uppercase tracking-[0.16em] opacity-50">Page</p>
                        <h3 className="mt-1 text-xl font-semibold">{current}</h3>
                        <div className="mt-5 grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className={`h-20 rounded-xl ${dark ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <ToggleControl label="Start collapsed" value={collapsed} onChange={setCollapsed} />
                </ControlGrid>
            }
            code={code}
            cli="sidebar-nav"
            props={props}
            dependencies={dependencies}
        />
    );
}
