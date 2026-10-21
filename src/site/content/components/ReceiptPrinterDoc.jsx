import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import ReceiptPrinter from '../../../components/MainUI/ApexUI-Kit/ReceiptPrinter/ReceiptPrinter.jsx';

const props = [
    { prop: 'items', type: 'array', def: 'café order', desc: 'Line items: { name, qty, price }.' },
    { prop: 'store', type: 'string', def: '"ApexUI Café"', desc: 'Name printed at the top of the receipt.' },
    { prop: 'address', type: 'string', def: '"221B Baker Street"', desc: 'Second line under the store name.' },
    { prop: 'currency', type: 'string', def: '"$"', desc: 'Currency symbol for prices.' },
    { prop: 'taxRate', type: 'number', def: '0.08', desc: 'Tax rate applied to the subtotal.' },
    { prop: 'orderId', type: 'string', def: '"AX-20491"', desc: 'Order number; also seeds the barcode.' },
    { prop: 'date', type: 'string', def: 'now', desc: 'Date line on the receipt. Defaults to the print time.' },
    { prop: 'stage', type: "'processing' | 'printing' | 'complete'", def: '—', desc: 'Control the stage yourself. Leave it out to let the printer run on its own.' },
    { prop: 'autoPlay', type: 'boolean', def: 'true', desc: 'Run processing → printing → complete on mount (uncontrolled only).' },
    { prop: 'feed', type: "'stepped' | 'smooth'", def: '"stepped"', desc: 'Paper feeds line by line, or in one smooth glide.' },
    { prop: 'processingTime', type: 'number', def: '1600', desc: 'Milliseconds spent on "Processing payment".' },
    { prop: 'printTime', type: 'number', def: '2200', desc: 'Milliseconds the paper takes to feed out.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'LED, status icon and progress color.' },
    { prop: 'onComplete', type: '() => void', def: '—', desc: 'Called when a self-running print finishes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Stage transitions and the paper feed.' },
    { name: 'Lucide React', desc: 'Status icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function ReceiptPrinterDoc() {
    const [feed, setFeed] = useState('stepped');
    const [accent, setAccent] = useState('#a3e635');
    const [printTime, setPrintTime] = useState(2200);

    const code = `import ReceiptPrinter from './ApexUI-Kit/ReceiptPrinter/ReceiptPrinter.jsx';

const items = [
  { name: "Iced Latte", qty: 2, price: 4.5 },
  { name: "Blueberry Muffin", qty: 1, price: 3.25 },
  { name: "Avocado Toast", qty: 1, price: 8.9 },
];

const App = () => (
  <ReceiptPrinter
    store="ApexUI Café"
    items={items}
    orderId="AX-20491"
    feed="${feed}"
    printTime={${printTime}}
    accentColor="${accent}"
    onComplete={() => console.log("printed")}
  />
);

export default App;`;

    return (
        <ComponentDoc
            title="Receipt Printer"
            description="A thermal printer that processes a payment and feeds a receipt out of its slot, line by line."
            // Remount on setting changes so each tweak prints a fresh receipt.
            preview={<ReceiptPrinter key={`${feed}-${printTime}`} feed={feed} printTime={printTime} accentColor={accent} />}
            previewClassName="!items-start pt-10"
            controls={
                <ControlGrid>
                    <SelectControl label="Feed" value={feed} onChange={setFeed} options={[{ value: 'stepped', label: 'Stepped' }, { value: 'smooth', label: 'Smooth' }]} />
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <RangeControl label="Print time" value={printTime} onChange={setPrintTime} min={1000} max={4000} step={200} format={(v) => `${(v / 1000).toFixed(1)}s`} />
                </ControlGrid>
            }
            code={code}
            cli="receipt-printer"
            props={props}
            dependencies={dependencies}
        />
    );
}
