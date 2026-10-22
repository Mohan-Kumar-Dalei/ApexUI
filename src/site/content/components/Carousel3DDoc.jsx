import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import { ControlGrid, RangeControl, ToggleControl } from '../../docs/controls.jsx';
import Carousel3D from '../../../components/MainUI/ApexUI-Kit/Carousel3D/Carousel3D.jsx';
import WebGLCarousel from '../../../components/MainUI/ApexUI-Kit/WebGLCarousel/WebGLCarousel.jsx';

const webglProps = [
    { prop: 'items', type: '{ image, title }[]', def: '8 demo heroes', desc: 'Images around the ring (must allow CORS).' },
    { prop: 'height', type: 'string', def: '"30rem"', desc: 'Height of the WebGL area.' },
    { prop: 'tilt', type: 'number', def: '3', desc: 'How far above the ring the camera looks down, in degrees.' },
    { prop: 'radiusScale', type: 'number', def: '0.83', desc: 'Ring size multiplier (bigger leaves more space between images).' },
    { prop: 'autoRotate', type: 'number', def: '6', desc: 'Idle spin in degrees per second (0 turns it off).' },
    { prop: 'borderRadius', type: 'number', def: '0.06', desc: 'Corner radius as a share of the image size.' },
    { prop: 'wheel', type: 'boolean', def: 'true', desc: 'Spin with a sideways trackpad swipe or Shift + wheel.' },
    { prop: 'showTitle', type: 'boolean', def: 'true', desc: 'Show the front image title below.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const webglDependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'OGL', desc: 'A tiny WebGL library, planes, textures and two small shaders.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const props = [
    { prop: 'items', type: '{ image, title, subtitle? }[]', def: '7 demo heroes', desc: 'Cards around the ring.' },
    { prop: 'cardWidth', type: 'number', def: '11', desc: 'Card width in rem (never wider than 40vw).' },
    { prop: 'aspectRatio', type: 'string', def: '"3 / 4"', desc: 'Card aspect ratio.' },
    { prop: 'gap', type: 'number', def: '1', desc: 'Extra ring radius between cards, in rem.' },
    { prop: 'tilt', type: 'number', def: '-6', desc: 'Camera tilt in degrees (negative looks down on the ring).' },
    { prop: 'perspective', type: 'number', def: '1400', desc: 'CSS perspective in px; lower is more dramatic.' },
    { prop: 'autoRotate', type: 'boolean', def: 'true', desc: 'Turn slowly on its own.' },
    { prop: 'autoRotateSpeed', type: 'number', def: '10', desc: 'Idle spin speed, in degrees per second.' },
    { prop: 'pauseOnHover', type: 'boolean', def: 'true', desc: 'Stop the idle spin while the pointer is over it.' },
    { prop: 'showControls', type: 'boolean', def: 'true', desc: 'Show the arrows and the active title below.' },
    { prop: 'onActiveChange', type: '(index, item) => void', def: 'none', desc: 'Called when a new card reaches the front.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Ring rotation, drag inertia and spring snapping.' },
    { name: 'Lucide React', desc: 'Arrow icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function Carousel3DDoc() {
    const [cardWidth, setCardWidth] = useState(11);
    const [tilt, setTilt] = useState(-6);
    const [perspective, setPerspective] = useState(1400);
    const [speed, setSpeed] = useState(10);
    const [autoRotate, setAutoRotate] = useState(true);
    const [glTilt, setGlTilt] = useState(3);
    const [glRadius, setGlRadius] = useState(0.83);
    const [glSpeed, setGlSpeed] = useState(6);

    const code = `import Carousel3D from './ApexUI-Kit/Carousel3D/Carousel3D.jsx';

const items = [
  { image: "/heroes/iron-man.png", title: "Iron Man", subtitle: "Genius, billionaire" },
  { image: "/heroes/spider-man.png", title: "Spider-Man", subtitle: "Friendly neighbour" },
  { image: "/heroes/hulk.png", title: "Hulk", subtitle: "Always angry" },
  // ...as many as you like
];

const App = () => (
  <Carousel3D
    items={items}
    cardWidth={${cardWidth}}
    tilt={${tilt}}
    perspective={${perspective}}${autoRotate ? `\n    autoRotateSpeed={${speed}}` : '\n    autoRotate={false}'}
    onActiveChange={(i, item) => console.log(item.title)}
  />
);

export default App;`;

    const variants = [
        {
            name: 'CSS Ring',
            description: 'Cards on a ring built with CSS 3D transforms, drag or swipe to spin it, let go and it settles on the nearest card, or click any card to bring it to the front.',
            preview: <Carousel3D cardWidth={cardWidth} tilt={tilt} perspective={perspective} autoRotate={autoRotate} autoRotateSpeed={speed} />,
            controls: (
                <ControlGrid>
                    <RangeControl label="Card width" value={cardWidth} onChange={setCardWidth} min={8} max={15} step={0.5} format={(v) => `${v}rem`} />
                    <RangeControl label="Tilt" value={tilt} onChange={setTilt} min={-20} max={10} step={1} format={(v) => `${v}°`} />
                    <RangeControl label="Perspective" value={perspective} onChange={setPerspective} min={600} max={2400} step={100} format={(v) => `${v}px`} />
                    <RangeControl label="Spin speed" value={speed} onChange={setSpeed} min={2} max={40} step={1} format={(v) => `${v}°/s`} />
                    <ToggleControl label="Auto rotate" value={autoRotate} onChange={setAutoRotate} />
                </ControlGrid>
            ),
            code,
            cli: '3d-carousel',
            props,
            dependencies,
        },
        {
            name: 'WebGL Ring',
            description: 'A full 360° ring of images drawn with OGL, drag to spin, fast spins ripple the images and the far side dims.',
            preview: <WebGLCarousel tilt={glTilt} radiusScale={glRadius} autoRotate={glSpeed} />,
            controls: (
                <ControlGrid>
                    <RangeControl label="Camera tilt" value={glTilt} onChange={setGlTilt} min={0} max={35} step={1} format={(v) => `${v}°`} />
                    <RangeControl label="Ring size" value={glRadius} onChange={setGlRadius} min={0.6} max={1.8} step={0.01} format={(v) => `${v.toFixed(2)}×`} />
                    <RangeControl label="Spin speed" value={glSpeed} onChange={setGlSpeed} min={0} max={30} step={1} format={(v) => `${v}°/s`} />
                </ControlGrid>
            ),
            code: `import WebGLCarousel from './ApexUI-Kit/WebGLCarousel/WebGLCarousel.jsx';

const items = [
  { image: "https://your-cdn.com/one.jpg", title: "One" },
  { image: "https://your-cdn.com/two.jpg", title: "Two" },
  // ...images must allow CORS
];

const App = () => (
  <WebGLCarousel
    items={items}
    tilt={${glTilt}}
    radiusScale={${glRadius}}
    autoRotate={${glSpeed}}
  />
);

export default App;`,
            cli: 'webgl-carousel',
            props: webglProps,
            dependencies: webglDependencies,
        },
    ];

    return (
        <ComponentDoc
            title="3D Carousel"
            description="Cards on a ring that turns in 3D, a light CSS ring, or a full 360° WebGL ring. Drag or swipe to spin, and it settles on the nearest card."
            variants={variants}
        />
    );
}
