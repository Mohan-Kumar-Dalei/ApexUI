import ComponentDoc from '../../docs/ComponentDoc.jsx';
import AccordionMarquee from '../../../components/MainUI/ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';

const code = `import AccordionMarquee from './ApexUI-Kit/AccordionMarquee/AccordionMarquee.jsx';

const App = () => {
  return (
    <AccordionMarquee
      bgColor='#bbf451'
      textColor='#27272a'
    />
  );
};

export default App;`;

const props = [
    { prop: 'bgColor', type: 'string', def: "'#bbf451'", desc: 'Background color of the marquee.' },
    { prop: 'textColor', type: 'string', def: "'#27272a'", desc: 'Text color of the marquee.' },
    { prop: 'items', type: 'array', def: '4 sample rows', desc: 'Rows to show, each with a title and the marquee text.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'Animation library for smooth effects.' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
];

export default function AccordionMarqueeDoc() {
    return (
        <ComponentDoc
            title="Accordion Marquee"
            description="An accordion where each row reveals a marquee on hover — great for highlighting key information."
            preview={<AccordionMarquee />}
            fullBleed
            code={code}
            cli="accordion-marquee"
            props={props}
            dependencies={dependencies}
        />
    );
}
