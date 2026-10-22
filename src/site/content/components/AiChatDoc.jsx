import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import AiChat from '../../../components/MainUI/ApexUI-Kit/AiChat/AiChat.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'onSend', type: '(text) => string | Promise<string>', def: 'demo replies', desc: 'Your model call; the returned text streams into the chat.' },
    { prop: 'title', type: 'string', def: '"Apex Assistant"', desc: 'Name in the header.' },
    { prop: 'greeting', type: 'string', def: 'demo greeting', desc: 'First assistant message.' },
    { prop: 'suggestions', type: 'string[]', def: '3 prompts', desc: 'Quick prompts shown before the first message.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'User bubble, logo and send button color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Panel colors.' },
    { prop: 'height', type: 'string', def: '"30rem"', desc: 'Chat height.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Message and typing animations.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AiChatDoc() {
    const theme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="AI Chat"
            description="A compact AI chat window — replies stream in word by word behind a typing indicator, with suggestion chips and auto-scroll. Plug in any model with one onSend function."
            preview={<AiChat key={theme} theme={theme} accentColor={accent} />}
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import AiChat from './ApexUI-Kit/AiChat/AiChat.jsx';

// Call your own backend / model here and return the reply text.
const ask = async (text) => {
  const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
  const data = await res.json();
  return data.reply;
};

const App = () => <AiChat onSend={ask} accentColor="${accent}" theme="${theme}" />;

export default App;`}
            cli="ai-chat"
            props={props}
            dependencies={dependencies}
        />
    );
}
