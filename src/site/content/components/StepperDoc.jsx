import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import Stepper from '../../../components/MainUI/ApexUI-Kit/Stepper/Stepper.jsx';

const props = [
    { prop: 'steps', type: "{ title, content }[]", def: "4 demo steps", desc: "The steps." },
    { prop: 'initialStep', type: "number", def: "0", desc: "Step to start on." },
    { prop: 'onStepChange', type: "(index) => void", def: "—", desc: "Called when the step changes." },
    { prop: 'onComplete', type: "() => void", def: "—", desc: "Called on Complete." },
    { prop: 'accentColor', type: "string", def: "\"#a3e635\"", desc: "Indicator and button color." },
    { prop: 'theme', type: "'dark' | 'light'", def: "\"dark\"", desc: "Panel colors." },
    { prop: 'className', type: "string", def: "\"\"", desc: "Extra classes." },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Indicator, connector and slide motion.' },
    { name: 'Lucide React', desc: 'Check icon.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function StepperDoc() {
    const [accent, setAccent] = useState('#a3e635');
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="Stepper"
            description="A multi-step flow — indicators fill and tick as you move on, connector lines fill in between, and each step slides in from the direction you are heading."
            preview={
                <Stepper accentColor={accent} theme={theme} />
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import Stepper from './ApexUI-Kit/Stepper/Stepper.jsx';

const App = () => (
  <div>
    <Stepper
      accentColor="${accent}"
      steps={[
        { title: "Account", content: <p>Pick a username.</p> },
        { title: "Profile", content: <p>Add a photo and bio.</p> },
        { title: "Done", content: <p>All set!</p> },
      ]}
      onComplete={() => router.push("/dashboard")}
    />
  </div>
);

export default App;`}
            cli="stepper"
            props={props}
            dependencies={dependencies}
        />
    );
}
