import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BeamBar from '../../../components/MainUI/ApexUI-Kit/BeamBar/BeamBar.jsx';

const code = `import BeamBar from './ApexUI-Kit/BeamBar/BeamBar.jsx';

const App = () => (
  <BeamBar
    fromColor="#a855f7"
    viaColor="#38bdf8"
    toColor="#06b6d4"
    barWidth={320}
    barHeight={8}
    duration={1.2}
    pulseDuration={2.5}
  />
);

export default App;`;

const props = [
    { prop: 'fromColor', type: 'string', def: '"#a855f7"', desc: 'Gradient start color (left).' },
    { prop: 'viaColor', type: 'string', def: '"#38bdf8"', desc: 'Gradient middle color.' },
    { prop: 'toColor', type: 'string', def: '"#06b6d4"', desc: 'Gradient end color (right).' },
    { prop: 'barWidth', type: 'number', def: '320', desc: 'Beam bar width in px.' },
    { prop: 'barHeight', type: 'number', def: '8', desc: 'Beam bar height in px.' },
    { prop: 'duration', type: 'number', def: '1.2', desc: 'Width expansion animation duration (seconds).' },
    { prop: 'pulseDuration', type: 'number', def: '2.5', desc: 'Pulse animation duration (seconds).' },
    { prop: 'fixed', type: 'boolean', def: 'true', desc: 'Pin the bar to the top of the viewport. Pass false to place it at the top of a relative parent.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'Framer Motion', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function BeamBarDoc() {
    return (
        <ComponentDoc
            title="Beam Bar"
            description="An animated beam bar with a pulsing light — perfect for modern loading states and dashboards."
            preview={
                <>
                    <BeamBar fixed={false} fromColor="#a855f7" viaColor="#38bdf8" toColor="#06b6d4" barWidth={320} barHeight={8} duration={1.2} pulseDuration={2.5} />
                    <div className="absolute left-1/2 w-full -translate-x-1/2 -translate-y-1/2 mt-12 flex flex-col items-center text-center sm:mt-16">
                        <h3 className="mb-2 text-2xl font-extrabold text-white sm:text-4xl">Animated BeamBar Effect</h3>
                        <p className="text-sm text-white/80 sm:text-lg">A perfect bar for modern dashboards.</p>
                    </div>
                </>
            }
            code={code}
            cli="beam-bar"
            props={props}
            dependencies={dependencies}
        />
    );
}
