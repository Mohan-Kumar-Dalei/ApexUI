import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl from '../../docs/controls.jsx';
import EdgeGlowForm from '../../../components/MainUI/ApexUI-Kit/EdgeGlowForm/EdgeGlowFrom.jsx';

const code = `import EdgeGlowForm from './ApexUI-Kit/EdgeGlowForm/EdgeGlowForm.jsx';

const App = () => (
  <EdgeGlowForm
    GlowColor="#a855f7"
    borderGlowColor="#a78bfa88"
    borderGlowShadow="#a78bfa33"
  />
);

export default App;`;

const props = [
    { prop: 'GlowColor', type: 'string', def: "'violet'", desc: 'Color of the glow that follows the pointer (alias: glowColor).' },
    { prop: 'borderGlowColor', type: 'string', def: "'#a78bfa88'", desc: 'Color of the focused field border.' },
    { prop: 'borderGlowShadow', type: 'string', def: "'#a78bfa33'", desc: 'Shadow color of the focused field border.' },
    { prop: 'onSubmit', type: '(values) => void', def: '—', desc: 'Called with the field values when a valid form is submitted.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'A production-ready motion library for React.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid UI development.' },
];

export default function EdgeGlowFormDoc() {
    const [glowColor, setGlowColor] = useState('#a855f7');
    return (
        <ComponentDoc
            title="Edge Glow Form"
            description="A form container that emits a soft, blurred gradient glow from its edges, with animated validation."
            preview={<EdgeGlowForm GlowColor={glowColor} />}
            controls={<ColorControl label="Glow color" value={glowColor} onChange={setGlowColor} />}
            code={code}
            cli="edge-glow-form"
            props={props}
            dependencies={dependencies}
        />
    );
}
