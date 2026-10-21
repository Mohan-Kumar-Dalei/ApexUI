import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import RollingCounter from '../../../components/MainUI/ApexUI-Kit/RollingCounter/RollingCounter.jsx';

const props = [
    { prop: 'value', type: 'number', def: '0', desc: 'The number to show. Change it and the digits roll to the new value.' },
    { prop: 'locale', type: 'string', def: '"en-US"', desc: 'Locale for separators and currency format.' },
    { prop: 'decimals', type: 'number', def: '0', desc: 'Digits after the decimal point.' },
    { prop: 'currency', type: 'string', def: '—', desc: 'ISO currency code (e.g. "USD", "INR") to format as money.' },
    { prop: 'prefix', type: 'string', def: '""', desc: 'Text before the number.' },
    { prop: 'suffix', type: 'string', def: '""', desc: 'Text after the number (e.g. "+", "%").' },
    { prop: 'fontSize', type: 'number', def: '4', desc: 'Font size, in rem.' },
    { prop: 'fontWeight', type: 'number', def: '700', desc: 'Font weight.' },
    { prop: 'color', type: 'string', def: '"currentColor"', desc: 'Text color.' },
    { prop: 'startOnView', type: 'boolean', def: 'true', desc: 'Roll up from 0 the first time it scrolls into view.' },
    { prop: 'spring', type: '{ stiffness, damping, mass }', def: '{ 70, 18, 1 }', desc: 'Spring used by every wheel.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Spring-driven digit wheels.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const FORMATS = {
    number: { label: 'Number', props: {} },
    usd: { label: 'US dollar', props: { currency: 'USD' } },
    inr: { label: 'Indian rupee', props: { currency: 'INR', locale: 'en-IN' } },
    eur: { label: 'Euro (de-DE)', props: { currency: 'EUR', locale: 'de-DE' } },
    percent: { label: 'Percent', props: { suffix: '%' } },
};

const btn = 'rounded-full border border-[var(--line)] bg-[var(--panel)] px-3.5 py-1.5 text-[0.8rem] font-medium text-[var(--ink)] transition hover:border-[var(--lime-line)] active:scale-95';

export default function RollingCounterDoc() {
    const [value, setValue] = useState(12840);
    const [format, setFormat] = useState('number');
    const [decimals, setDecimals] = useState(0);
    const [size, setSize] = useState(4);
    const [color, setColor] = useState('#a3e635');

    const f = FORMATS[format].props;
    const formatCode = Object.entries(f).map(([k, v]) => `\n        ${k}="${v}"`).join('');

    const code = `import { useState } from 'react';
import RollingCounter from './ApexUI-Kit/RollingCounter/RollingCounter.jsx';

const App = () => {
  const [value, setValue] = useState(${value});
  return (
    <>
      <RollingCounter
        value={value}${formatCode}${decimals ? `\n        decimals={${decimals}}` : ''}
        fontSize={${size}}
        color="${color}"
      />
      <button onClick={() => setValue((v) => v + 250)}>+250</button>
    </>
  );
};

export default App;`;

    return (
        <ComponentDoc
            title="Rolling Counter"
            description="An odometer-style number — every digit is a wheel that rolls to its new value and carries into the next, with locale, currency and decimals built in."
            preview={
                <div className="flex w-full flex-col items-center gap-7">
                    <RollingCounter value={value} decimals={decimals} fontSize={size} color={color} {...f} />
                    <div className="flex flex-wrap justify-center gap-2">
                        <button type="button" className={btn} onClick={() => setValue((v) => v - 10)}>−10</button>
                        <button type="button" className={btn} onClick={() => setValue((v) => v + 1)}>+1</button>
                        <button type="button" className={btn} onClick={() => setValue((v) => v + 250)}>+250</button>
                        <button type="button" className={btn} onClick={() => setValue(Math.round(Math.random() * 9999900) / 100)}>Random</button>
                    </div>
                </div>
            }
            controls={
                <ControlGrid>
                    <SelectControl label="Format" value={format} onChange={setFormat} options={Object.entries(FORMATS).map(([v, o]) => ({ value: v, label: o.label }))} />
                    <RangeControl label="Decimals" value={decimals} onChange={setDecimals} min={0} max={2} />
                    <RangeControl label="Size" value={size} onChange={setSize} min={2} max={6} step={0.25} format={(v) => `${v}rem`} />
                    <ColorControl label="Color" value={color} onChange={setColor} />
                </ControlGrid>
            }
            code={code}
            cli="rolling-counter"
            props={props}
            dependencies={dependencies}
        />
    );
}
