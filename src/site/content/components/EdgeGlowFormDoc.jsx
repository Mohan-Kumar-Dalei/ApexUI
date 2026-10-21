import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import EdgeGlowForm from '../../../components/MainUI/ApexUI-Kit/EdgeGlowForm/EdgeGlowFrom.jsx';

const props = [
    { prop: 'GlowColor', type: 'string', def: "'violet'", desc: 'Color of the edge glow that follows the pointer around the form.' },
    { prop: 'borderGlowColor', type: 'string', def: "'#a78bfa88'", desc: 'Edge color (hex) of focused fields, floating labels, the checkbox and the button.' },
    { prop: 'borderGlowShadow', type: 'string', def: "'#a78bfa33'", desc: 'Shadow color of the focused field edges.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'A production-ready motion library for React.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid UI development.' },
];

export default function EdgeGlowFormDoc() {
    const [glowColor, setGlowColor] = useState('#a855f7');
    const [edgeColor, setEdgeColor] = useState('#a78bfa');
    const code = `import EdgeGlowForm from './ApexUI-Kit/EdgeGlowForm/EdgeGlowForm.jsx';

const App = () => (
  <EdgeGlowForm
    GlowColor="${glowColor}"
    borderGlowColor="${edgeColor}88"
    borderGlowShadow="${edgeColor}33"
  />
);

export default App;`;
    return (
        <ComponentDoc
            title="Edge Glow Form"
            description="A form whose edge glows where the pointer is, with floating labels, glowing field edges and animated validation."
            preview={<EdgeGlowForm GlowColor={glowColor} borderGlowColor={`${edgeColor}88`} borderGlowShadow={`${edgeColor}33`} />}
            controls={
                <ControlGrid>
                    <ColorControl label="Glow color" value={glowColor} onChange={setGlowColor} />
                    <ColorControl label="Edge color" value={edgeColor} onChange={setEdgeColor} />
                </ControlGrid>
            }
            code={code}
            cli="edge-glow-form"
            props={props}
            dependencies={dependencies}
        />
    );
}
