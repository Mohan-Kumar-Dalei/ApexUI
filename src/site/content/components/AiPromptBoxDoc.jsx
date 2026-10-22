import ComponentDoc from '../../docs/ComponentDoc.jsx';
import AiPromptBox from '../../../components/MainUI/ApexUI-Kit/AiPromptBox/AiPromptBox.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'onSubmit', type: '({ prompt, model, files }) => void | Promise', def: 'demo delay', desc: 'Called on Enter / send; the button shows Stop until the promise settles.' },
    { prop: 'placeholder', type: 'string', def: 'demo text', desc: 'Textarea placeholder.' },
    { prop: 'models', type: 'string[]', def: '3 models', desc: 'Model picker options.' },
    { prop: 'actions', type: 'string[]', def: '4 actions', desc: 'Quick action chips under the box.' },
    { prop: 'maxLength', type: 'number', def: '2000', desc: 'Character limit (shown as a counter).' },
    { prop: 'colors', type: 'string[]', def: 'lime / cyan / violet / pink', desc: 'Glowing border colors; the first is the send button.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Box colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Menu, chips and send / stop morph.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AiPromptBoxDoc() {
    const theme = useSiteTheme();
    return (
        <ComponentDoc
            title="AI Prompt Box"
            description="The input of an AI app — a glowing animated border on focus that spins faster while generating, an auto-growing textarea, model picker, attachments, quick actions and a send button that turns into stop."
            preview={<AiPromptBox theme={theme} />}
            code={`import AiPromptBox from './ApexUI-Kit/AiPromptBox/AiPromptBox.jsx';

const App = () => (
  <AiPromptBox
    theme="${theme}"
    models={["GPT-5", "Claude", "Gemini"]}
    onSubmit={async ({ prompt, model, files }) => {
      await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt, model }) });
    }}
  />
);

export default App;`}
            cli="ai-prompt-box"
            props={props}
            dependencies={dependencies}
        />
    );
}
