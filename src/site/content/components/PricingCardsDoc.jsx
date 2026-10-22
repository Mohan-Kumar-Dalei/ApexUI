import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, SelectControl } from '../../docs/controls.jsx';
import PricingCards from '../../../components/MainUI/ApexUI-Kit/PricingCards/PricingCards.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'plans', type: '{ name, monthly, yearly, description, features, cta, featured? }[]', def: '3 demo plans', desc: 'Plans to show; one can be featured.' },
    { prop: 'currency', type: 'string', def: '"$"', desc: 'Currency symbol.' },
    { prop: 'yearlyNote', type: 'string', def: '"Save 20%"', desc: 'Badge next to the billing switch.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Switch, featured plan and checkmarks.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Card colors.' },
    { prop: 'onSelect', type: "(plan, period) => void", def: 'none', desc: 'Called when a plan button is clicked.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Sliding prices, switch pill and hover lift.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function PricingCardsDoc() {
    const theme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    const [currency, setCurrency] = useState('$');

    const code = `import PricingCards from './ApexUI-Kit/PricingCards/PricingCards.jsx';

const plans = [
  { name: "Starter", monthly: 0, yearly: 0, description: "For side projects.", features: ["10 components"], cta: "Start free" },
  { name: "Pro", monthly: 19, yearly: 15, description: "For freelancers.", features: ["All components", "Figma kit"], cta: "Go Pro", featured: true },
];

const App = () => <PricingCards plans={plans} currency="${currency}" accentColor="${accent}" theme="${theme}" />;

export default App;`;

    return (
        <ComponentDoc
            title="Pricing Cards"
            description="Plans side by side with a monthly / yearly switch, prices slide to their new value, the featured plan glows and every card lifts on hover."
            preview={<PricingCards accentColor={accent} theme={theme} currency={currency} className="max-w-4xl py-4" />}
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                    <SelectControl label="Currency" value={currency} onChange={setCurrency} options={[{ value: '$', label: 'Dollar ($)' }, { value: '₹', label: 'Rupee (₹)' }, { value: '€', label: 'Euro (€)' }]} />
                </ControlGrid>
            }
            code={code}
            cli="pricing-cards"
            props={props}
            dependencies={dependencies}
        />
    );
}
