import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import AnimatedTabs from '../../../components/MainUI/ApexUI-Kit/AnimatedTabs/AnimatedTabs.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'tabs', type: '{ id, label, content }[]', def: '4 demo tabs', desc: 'Tabs and the content each one shows.' },
    { prop: 'defaultTab', type: 'string', def: 'first tab', desc: 'Id of the tab that starts selected.' },
    { prop: 'variant', type: "'pill' | 'underline' | 'segmented'", def: '"pill"', desc: 'Indicator style.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Pill / underline color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Text and surface colors.' },
    { prop: 'onChange', type: '(id) => void', def: '—', desc: 'Called when the tab changes.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Shared-layout indicator and panel transitions.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AnimatedTabsDoc() {
    const theme = useSiteTheme();
    const [variant, setVariant] = useState('pill');
    const [accent, setAccent] = useState('#a3e635');

    const code = `import AnimatedTabs from './ApexUI-Kit/AnimatedTabs/AnimatedTabs.jsx';

const tabs = [
  { id: "overview", label: "Overview", content: "Everything at a glance." },
  { id: "analytics", label: "Analytics", content: "Visitors and conversions." },
  { id: "settings", label: "Settings", content: "Workspace and billing." },
];

const App = () => <AnimatedTabs tabs={tabs} variant="${variant}" accentColor="${accent}" theme="${theme}" />;

export default App;`;

    return (
        <ComponentDoc
            title="Animated Tabs"
            description="Tabs with a sliding indicator — pill, underline or segmented — and panels that slide in from the side you moved toward. Keyboard friendly."
            preview={<AnimatedTabs key={variant} variant={variant} accentColor={accent} theme={theme} />}
            controls={
                <ControlGrid>
                    <SelectControl label="Style" value={variant} onChange={setVariant} options={[{ value: 'pill', label: 'Pill' }, { value: 'underline', label: 'Underline' }, { value: 'segmented', label: 'Segmented' }]} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={code}
            cli="animated-tabs"
            props={props}
            dependencies={dependencies}
        />
    );
}
