import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, SelectControl, ToggleControl } from '../../docs/controls.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';
import EdgeBlur from '../../../components/MainUI/ApexUI-Kit/EdgeBlur/EdgeBlur.jsx';

const IK = 'https://ik.imagekit.io/ny6yinyut/apexui/assets/componentsimage';
const POSTS = [
    ['galaxy-3d.png', 'Galaxy 3D', 'A turning spiral galaxy for hero sections.'],
    ['liquid-blob-3d.png', 'Liquid Blob 3D', 'A glossy blob that ripples toward the pointer.'],
    ['warp-tunnel.png', 'Warp Tunnel', 'Hold to boost into hyperspace.'],
    ['gooey-nav-v3.png', 'Gooey Nav', 'A liquid pill that stretches between links.'],
    ['particle-text.png', 'Particle Text', 'Words made of particles that dodge the pointer.'],
    ['retro-grid-3d.png', 'Retro Grid 3D', 'A synthwave landscape with a striped sun.'],
];

const props = [
    { prop: 'edge', type: "'top' | 'bottom' | 'left' | 'right'", def: '"bottom"', desc: 'Edge the blur grows toward.' },
    { prop: 'size', type: 'string | number', def: '"6rem"', desc: 'How far the blur reaches in from the edge (numbers are px).' },
    { prop: 'blur', type: 'number', def: '16', desc: 'Blur at the very edge, in px.' },
    { prop: 'steps', type: 'number', def: '6', desc: 'Blur layers (2 to 10). More layers give a smoother ramp.' },
    { prop: 'tint', type: 'string', def: '"transparent"', desc: 'Color the content fades into at the edge, e.g. your background.' },
    { prop: 'hideAtEnd', type: 'boolean', def: 'false', desc: 'Fade out when the scroll reaches this edge (nothing more to see).' },
    { prop: 'scroller', type: 'ref | element', def: 'sibling or parent', desc: 'Scroll container to watch for hideAtEnd.' },
    { prop: 'fixed', type: 'boolean', def: 'false', desc: 'Pin to the viewport edge instead of the parent.' },
    { prop: 'zIndex', type: 'number', def: '10', desc: 'Stacking order.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function EdgeBlurDoc() {
    const theme = useSiteTheme();
    const [edges, setEdges] = useState('both');
    const [blur, setBlur] = useState(16);
    const [size, setSize] = useState(6);
    const [steps, setSteps] = useState(6);
    const [tint, setTint] = useState(true);
    const [hide, setHide] = useState(true);
    const bg = theme === 'light' ? '#ffffff' : '#0a0a0a';
    const blurProps = { blur, steps, size: `${size}rem`, tint: tint ? bg : 'transparent', hideAtEnd: hide };

    return (
        <ComponentDoc
            title="Edge Blur"
            description="A soft, progressive blur along the edge of a scrolling area, the way content melts under an app bar or fades out at the end of a list. Stacked backdrop-blur layers double toward the edge for a smooth ramp, with an optional tint and auto hide at the end of the scroll."
            preview={
                <div className="relative h-[24rem] w-full max-w-sm overflow-hidden rounded-3xl border border-[var(--line)]" style={{ background: bg }}>
                    <div className="thin-scroll h-full overflow-y-auto px-4 py-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-3)]">Scroll me</p>
                        <div className="space-y-4">
                            {POSTS.map(([img, title, body]) => (
                                <article key={title} className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
                                    <img src={`${IK}/${img}?tr=f-auto,q-75,w-600`} alt="" className="aspect-video w-full object-cover" />
                                    <div className="p-3">
                                        <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                                        <p className="text-xs text-[var(--ink-3)]">{body}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                    {(edges === 'both' || edges === 'top') && <EdgeBlur edge="top" {...blurProps} />}
                    {(edges === 'both' || edges === 'bottom') && <EdgeBlur edge="bottom" {...blurProps} />}
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Edges" value={edges} onChange={setEdges} options={[{ value: 'both', label: 'Top + bottom' }, { value: 'bottom', label: 'Bottom' }, { value: 'top', label: 'Top' }]} />
                    <RangeControl label="Blur" value={blur} onChange={setBlur} min={2} max={40} step={1} format={(v) => `${v}px`} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={2} max={12} step={0.5} format={(v) => `${v}rem`} />
                    <RangeControl label="Steps" value={steps} onChange={setSteps} min={2} max={10} step={1} />
                    <ToggleControl label="Tint" value={tint} onChange={setTint} />
                    <ToggleControl label="Hide at end" value={hide} onChange={setHide} />
                </ControlGrid>
            }
            code={`import EdgeBlur from './ApexUI-Kit/EdgeBlur/EdgeBlur.jsx';

const App = () => (
  <section className="relative h-[32rem] overflow-hidden">
    <div className="h-full overflow-y-auto">{/* your list */}</div>
    <EdgeBlur edge="bottom" size="${size}rem" blur={${blur}} steps={${steps}}${tint ? ` tint="${bg}"` : ''}${hide ? ' hideAtEnd' : ''} />
  </section>
);

export default App;`}
            cli="edge-blur"
            props={props}
            dependencies={dependencies}
        />
    );
}
