import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import CommandPalette from '../../../components/MainUI/ApexUI-Kit/CommandPalette/CommandPalette.jsx';

const props = [
    { prop: 'groups', type: '{ heading: string, items: { id, label, icon?, hint?, shortcut?, keywords? }[] }[]', def: 'demo commands', desc: 'Commands in groups. keywords are extra words that also match.' },
    { prop: 'placeholder', type: 'string', def: '"Type a command or search…"', desc: 'Search box placeholder.' },
    { prop: 'hotkey', type: 'string', def: '"k"', desc: 'Key that opens it with ⌘ or Ctrl.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Matched letters, active icon and the highlight marker.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Color scheme.' },
    { prop: 'contained', type: 'boolean', def: 'false', desc: 'Open inside the nearest positioned parent instead of over the whole page.' },
    { prop: 'triggerLabel', type: 'string', def: '"Search"', desc: 'Text on the button that opens it.' },
    { prop: 'defaultOpen', type: 'boolean', def: 'false', desc: 'Start open.' },
    { prop: 'onSelect', type: '(item) => void', def: 'undefined', desc: 'Called with the chosen command.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Lucide React', desc: 'Icons for the demo commands.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function CommandPaletteDoc() {
    const theme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');

    return (
        <ComponentDoc
            title="Command Palette"
            description="A ⌘K / Ctrl+K search box for jumping anywhere. Typing filters with a forgiving fuzzy match and highlights the matched letters, the arrow keys slide a highlight between rows, Enter runs the command and Escape closes. It eases in and out with CSS only, so it never blinks."
            preview={
                <div className="absolute inset-0 flex items-start justify-center px-4 pt-12">
                    <CommandPalette accentColor={accent} theme={theme} contained triggerLabel="Search docs…" className="w-full max-w-xs" />
                </div>
            }
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import { FileText, Settings } from 'lucide-react';
import CommandPalette from './ApexUI-Kit/CommandPalette/CommandPalette.jsx';

const groups = [
  {
    heading: 'Pages',
    items: [
      { id: 'docs', label: 'Documentation', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings, shortcut: ',' },
    ],
  },
];

const App = () => (
  <CommandPalette
    groups={groups}
    accentColor="${accent}"
    theme="${theme}"
    onSelect={(item) => console.log(item.id)}
  />
);

export default App;`}
            cli="command-palette"
            props={props}
            dependencies={dependencies}
        />
    );
}
