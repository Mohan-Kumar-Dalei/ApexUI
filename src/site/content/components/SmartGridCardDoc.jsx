import { useState } from 'react';
import { Monitor } from 'lucide-react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import SmartGridCard from '../../../components/MainUI/ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

const mergeOptions = [
    { label: 'Merge 4 → 1', source: 4, target: 1 },
    { label: 'Merge 5 → 2', source: 5, target: 2 },
    { label: 'Merge 6 → 3', source: 6, target: 3 },
];

const printMergeMap = (obj) => {
    const entries = Object.entries(obj);
    return entries.length ? `{ ${entries.map(([k, v]) => `${k}: ${v}`).join(', ')} }` : '{}';
};

const props = [
    { prop: 'cards', type: 'array', def: 'defaultCards()', desc: 'Card objects with id, icon, title, description and buttonText.' },
    { prop: 'mergeMap', type: 'object', def: '{}', desc: 'Cards to merge, as { source: target } — e.g. { 5: 2 } merges card 5 into card 2.' },
    { prop: 'borderColor', type: 'string', def: '"cyan"', desc: 'Border color of the grid cards.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function SmartGridCardDoc() {
    const [mergeMap, setMergeMap] = useState({ 5: 2 });
    const code = `import SmartGridCard from './ApexUI-Kit/SmartGridCard/SmartGridCard.jsx';

const App = () => (
  <SmartGridCard mergeMap={${printMergeMap(mergeMap)}} />
);

export default App;`;

    const pill = 'rounded-full border px-3 py-1 text-sm transition-colors';
    return (
        <ComponentDoc
            title="Smart Grid Card"
            description="A responsive grid of cards that can merge into each other to create unique layouts."
            preview={
                <>
                    <div className="hidden w-full shrink-0 items-center justify-center lg:flex lg:scale-[0.82]">
                        <SmartGridCard mergeMap={mergeMap} />
                    </div>
                    <div className="flex flex-col items-center py-10 text-center lg:hidden">
                        <Monitor className="mb-4 h-10 w-10 text-lime-300" />
                        <h4 className="mb-1 text-lg font-semibold text-white">Best viewed on a larger screen</h4>
                        <p className="max-w-xs text-sm text-zinc-400">This interactive grid needs a wider viewport to preview.</p>
                    </div>
                </>
            }
            controls={
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-sm text-[var(--fg-muted)]">Merge</span>
                    {mergeOptions.map(({ label, source, target }) => {
                        const active = mergeMap[source] === target;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setMergeMap((prev) => ({ ...prev, [source]: target }))}
                                className={`${pill} ${active ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]' : 'border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                    <button type="button" onClick={() => setMergeMap({})} className={`${pill} border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]`}>
                        Reset
                    </button>
                </div>
            }
            code={code}
            cli="smart-grid-card"
            props={props}
            dependencies={dependencies}
        />
    );
}
