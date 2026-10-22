import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, ToggleControl } from '../../docs/controls.jsx';
import FaqAccordion from '../../../components/MainUI/ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'items', type: '{ q, a }[]', def: '4 demo questions', desc: 'Questions and answers.' },
    { prop: 'multiple', type: 'boolean', def: 'false', desc: 'Allow several answers open at once.' },
    { prop: 'defaultOpen', type: 'number[]', def: '[0]', desc: 'Indexes open at the start.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Color of the open item’s icon.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Text and surface colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Height and icon springs.' },
    { name: 'Lucide React', desc: 'Plus icon.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function FaqAccordionDoc() {
    const theme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    const [multiple, setMultiple] = useState(false);

    const code = `import FaqAccordion from './ApexUI-Kit/FaqAccordion/FaqAccordion.jsx';

const items = [
  { q: "Is it free?", a: "Yes, every component is free and open source." },
  { q: "Does it work with Next.js?", a: "Yes, it's plain React with Tailwind CSS." },
];

const App = () => <FaqAccordion items={items} accentColor="${accent}" theme="${theme}"${multiple ? ' multiple' : ''} />;

export default App;`;

    return (
        <ComponentDoc
            title="FAQ Accordion"
            description="Questions that open with a smooth height animation and a plus that turns into a cross, one at a time or several together."
            preview={<FaqAccordion key={String(multiple)} accentColor={accent} theme={theme} multiple={multiple} />}
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <ToggleControl label="Allow several open" value={multiple} onChange={setMultiple} />
                </ControlGrid>
            }
            code={code}
            cli="faq-accordion"
            props={props}
            dependencies={dependencies}
        />
    );
}
