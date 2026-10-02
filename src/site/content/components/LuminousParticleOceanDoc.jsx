import ComponentDoc from '../../docs/ComponentDoc.jsx';
import BackgroundDemo from '../../docs/BackgroundDemo.jsx';
import LuminousParticleOcean from '../../../components/MainUI/ApexUI-Kit/LuminousParticleOcean/LuminousParticleOcean.jsx';

const code = `import LuminousParticleOcean from './ApexUI-Kit/LuminousParticleOcean/LuminousParticleOcean.jsx';

const App = () => (
  <div className="relative w-full h-screen">
    <LuminousParticleOcean
      sphereCount={100}
      sphereColor="#00aaff"
      interactionStrength={15}
      separation={4}
      bgColor1="#010a2d"
      bgColor2="#001133"
    />
    {/* Your content here */}
  </div>
);

export default App;`;

const props = [
    { prop: 'sphereCount', type: 'number', def: '100', desc: 'Number of spheres in the ocean.' },
    { prop: 'sphereColor', type: 'string', def: "'#00aaff'", desc: 'Color of the spheres.' },
    { prop: 'interactionStrength', type: 'number', def: '15', desc: 'Strength of the mouse interaction.' },
    { prop: 'separation', type: 'number', def: '4', desc: 'Separation between spheres.' },
    { prop: 'bgColor1', type: 'string', def: "'#010a2d'", desc: 'First background gradient color.' },
    { prop: 'bgColor2', type: 'string', def: "'#001133'", desc: 'Second background gradient color.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
    { name: 'Three.js', desc: 'A powerful 3D library for immersive graphics.' },
];

export default function LuminousParticleOceanDoc() {
    return (
        <ComponentDoc
            title="Luminous Particle Ocean"
            description="A 3D ocean of glowing particles with dynamic lighting that ripples under the pointer."
            preview={
                <BackgroundDemo title="Luminous Particle Ocean Demo">
                    <LuminousParticleOcean sphereCount={100} sphereColor="#51a2ff" interactionStrength={15} separation={4} bgColor1="#010a2d" bgColor2="#001133" />
                </BackgroundDemo>
            }
            fullBleed
            code={code}
            cli="luminous-particle-ocean"
            props={props}
            dependencies={dependencies}
        />
    );
}
