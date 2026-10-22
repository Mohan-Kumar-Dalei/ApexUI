import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import FlipBook from '../../../components/MainUI/ApexUI-Kit/FlipBook/FlipBook.jsx';

const props = [
    { prop: 'pages', type: '{ title, body, cover? }[]', def: '6 demo pages', desc: 'Pages in reading order; two pages share a sheet (front and back).' },
    { prop: 'width', type: 'number', def: '13', desc: 'Width of one page in rem.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Cover and chapter colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring page turns.' },
    { name: 'Lucide React', desc: 'Arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function FlipBookDoc() {
    const [accent, setAccent] = useState('#a3e635');
    return (
        <ComponentDoc
            title="Flip Book"
            description="A small 3D book whose pages turn around the spine — click a page, use the buttons or the arrow keys, and read content on both sides of every sheet."
            preview={<FlipBook accentColor={accent} className="py-6 text-[var(--ink)]" />}
            controls={
                <ControlGrid>
                    <ColorControl label="Cover" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import FlipBook from './ApexUI-Kit/FlipBook/FlipBook.jsx';

const pages = [
  { title: "My book", body: "A short story", cover: true },
  { title: "Chapter 1", body: "Once upon a time…" },
  { title: "Chapter 2", body: "…and then." },
  { title: "The end", body: "Thanks for reading", cover: true },
];

const App = () => <FlipBook pages={pages} accentColor="${accent}" />;

export default App;`}
            cli="flip-book"
            props={props}
            dependencies={dependencies}
        />
    );
}
