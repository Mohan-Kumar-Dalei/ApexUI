import { useState } from 'react';
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
    { prop: 'mergeMap', type: 'object', def: '{}', desc: 'Cards to merge, as { source: target } — e.g. { 5: 2 } hides card 5 and grows card 2 into its place (3-column layout).' },
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
            description="A responsive card grid whose cards smoothly merge into each other to form new layouts. Columns follow the grid's own width."
            preview={
<SmartGridCard mergeMap={mergeMap} />
            }
            controls={
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-2 text-sm text-[var(--ink-2)]">Merge</span>
                    {mergeOptions.map(({ label, source, target }) => {
                        const active = mergeMap[source] === target;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setMergeMap((prev) => ({ ...prev, [source]: target }))}
                                className={`${pill} ${active ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]' : 'border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                    <button type="button" onClick={() => setMergeMap({})} className={`${pill} border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)]`}>
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
