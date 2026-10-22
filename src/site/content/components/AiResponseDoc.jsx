import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl } from '../../docs/controls.jsx';
import AiResponse from '../../../components/MainUI/ApexUI-Kit/AiResponse/AiResponse.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'blocks', type: "{ type: 'text' | 'code', text, lang? }[]", def: 'demo answer', desc: 'The answer, as paragraphs and code blocks.' },
    { prop: 'sources', type: '{ title, href }[]', def: '2 links', desc: 'Numbered source chips under the answer.' },
    { prop: 'speed', type: 'number', def: '18', desc: 'Milliseconds per streaming tick (lower is faster).' },
    { prop: 'assistant', type: 'string', def: '"Apex AI"', desc: 'Name above the answer.' },
    { prop: 'onRegenerate', type: '() => void', def: '—', desc: 'Called by the regenerate button (it also replays the stream).' },
    { prop: 'onFeedback', type: "('up' | 'down' | null) => void", def: '—', desc: 'Called when a thumb is toggled.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Logo, cursor and active thumb color.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Card colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Footer reveal and button taps.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AiResponseDoc() {
    const theme = useSiteTheme();
    const [speed, setSpeed] = useState(18);
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="AI Response"
            description="An assistant answer that streams in with paragraphs, a copyable code block, numbered sources and an action bar — copy, regenerate, thumbs up and down."
            preview={<AiResponse key={speed} theme={theme} speed={speed} accentColor={accent} />}
            controls={
                <ControlGrid>
                    <RangeControl label="Stream tick" value={speed} onChange={setSpeed} min={5} max={60} step={1} format={(v) => `${v}ms`} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import AiResponse from './ApexUI-Kit/AiResponse/AiResponse.jsx';

const blocks = [
  { type: "text", text: "Here is how to center a div:" },
  { type: "code", lang: "css", text: ".box { display: grid; place-items: center; }" },
];

const App = () => (
  <AiResponse
    blocks={blocks}
    sources={[{ title: "MDN", href: "https://developer.mozilla.org" }]}
    accentColor="${accent}"
    theme="${theme}"
    onFeedback={(v) => console.log(v)}
  />
);

export default App;`}
            cli="ai-response"
            props={props}
            dependencies={dependencies}
        />
    );
}
