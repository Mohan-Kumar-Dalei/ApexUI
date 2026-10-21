import ComponentDoc from '../../docs/ComponentDoc.jsx';
import MaskView from '../../../components/MainUI/ApexUI-Kit/MaskView/MaskView.jsx';

const snippet = (props) => `import MaskView from './ApexUI-Kit/MaskView/MaskView.jsx';

const App = () => (
  <MaskView
${props}
  />
);

export default App;`;

const sharedProps = [
    { prop: 'variant', type: "'window' | 'spotlight' | 'wipe'", def: "'spotlight'", desc: 'Which mask effect to use.' },
    { prop: 'text', type: 'string', def: 'per variant', desc: 'Text to reveal. Use \\n for line breaks.' },
    { prop: 'accentColor', type: 'string', def: '"#a855f7"', desc: 'Accent color of the corner label dot.' },
];

const dependencies = [
    { name: 'React', desc: 'Modern React library for UI building.' },
    { name: 'GSAP', desc: 'A professional-grade animation library.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const variants = [
    {
        name: 'Text Window',
        description: 'Big letters act as a window onto an image that pans with the pointer; tap to open the whole picture.',
        preview: <MaskView variant="window" image="https://ik.imagekit.io/ny6yinyut/apexui/assets/ironman.png?updatedAt=1792562203671" />,
        code: snippet(`    variant="window"
    text={"MASK\\nVIEW"}
    image="https://ik.imagekit.io/ny6yinyut/apexui/assets/ironman.png?updatedAt=1792562203671"`),
        cli: 'mask-view',
        props: [
            ...sharedProps,
            { prop: 'image', type: 'string', def: 'Iron Man', desc: 'Image seen through the letters (window variant).' },
            { prop: 'animationSpeed', type: 'number', def: '0.4', desc: 'How quickly the image pans after the pointer, in seconds.' },
        ],
        dependencies,
    },
    {
        name: 'Spotlight',
        description: 'Near-hidden text lit by a soft spotlight that follows the pointer, and drifts on its own when idle.',
        preview: <MaskView variant="spotlight" animationSpeed={0.5} />,
        code: snippet(`    variant="spotlight"
    text={"Look through the mask.\\nOnly what sits under the light\\ncomes into focus."}
    animationSpeed={0.4}`),
        cli: 'mask-view',
        props: [
            ...sharedProps,
            { prop: 'animationSpeed', type: 'number', def: '0.4', desc: 'How quickly the light follows the pointer, in seconds.' },
        ],
        dependencies,
    },
    {
        name: 'Wipe Reveal',
        description: 'Text behind steamed-up glass: wipe it clear with the pointer or a finger, and it slowly fogs back over.',
        preview: <MaskView variant="wipe" />,
        code: snippet(`    variant="wipe"
    text={"Wipe the glass.\\nThe words underneath\\nare waiting for you."}`),
        cli: 'mask-view',
        props: sharedProps,
        dependencies,
    },
];

export default function MaskViewDoc() {
    return (
        <ComponentDoc
            title="Mask View"
            description="Reveal content through a mask — letters as a window onto an image, a spotlight in the dark, or steamed-up glass you wipe clear."
            variants={variants}
        />
    );
}
