import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { SelectControl } from '../../docs/controls.jsx';
import NavMenu from '../../../components/MainUI/ApexUI-Kit/NavMenu/NavMenu.jsx';

const props = [
    { prop: 'indicatorColor', type: 'string', def: '"#7c3aed"', desc: 'Color of the moving indicator.' },
    { prop: 'backgroundColor', type: 'string', def: '"#1f1f1f"', desc: 'Background of the navbar.' },
    { prop: 'activeColor', type: 'string', def: '"#ffffff"', desc: 'Color of the active nav item.' },
    { prop: 'indicatorAnimation', type: "'elastic' | 'spring' | 'power'", def: '"elastic"', desc: 'Animation style of the indicator.' },
    { prop: 'shrinkOnScroll', type: 'boolean', def: 'false', desc: 'Shrinks the navbar on scroll when true.' },
    { prop: 'position', type: 'string', def: '"fixed"', desc: 'CSS position of the navbar.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function NavMenuDoc() {
    const [indicatorColor, setIndicatorColor] = useState('#9AE203');
    const [backgroundColor, setBackgroundColor] = useState('#0F172B');
    const [activeColor, setActiveColor] = useState('#ffffff');
    const [indicatorAnimation, setIndicatorAnimation] = useState('elastic');
    const code = `import NavMenu from './ApexUI-Kit/NavMenu/NavMenu.jsx';

const App = () => (
  <NavMenu
    indicatorColor="${indicatorColor}"
    backgroundColor="${backgroundColor}"
    activeColor="${activeColor}"
    indicatorAnimation="${indicatorAnimation}"
  />
);

export default App;`;
    return (
        <ComponentDoc
            title="Nav Menu"
            description="Navigation with an animated active indicator — perfect for dashboards and landing pages."
            preview={
                <NavMenu
                    indicatorColor={indicatorColor}
                    backgroundColor={backgroundColor}
                    activeColor={activeColor}
                    indicatorAnimation={indicatorAnimation}
                />
            }
            previewClassName="!items-start"
            controls={
                <div className="grid gap-4 sm:grid-cols-2">
                    <ColorControl label="Indicator" value={indicatorColor} onChange={setIndicatorColor} />
                    <ColorControl label="Background" value={backgroundColor} onChange={setBackgroundColor} />
                    <ColorControl label="Active color" value={activeColor} onChange={setActiveColor} />
                    <SelectControl label="Animation" value={indicatorAnimation} onChange={setIndicatorAnimation} options={['elastic', 'spring', 'power']} />
                </div>
            }
            code={code}
            cli="nav-menu"
            props={props}
            dependencies={dependencies}
        />
    );
}
