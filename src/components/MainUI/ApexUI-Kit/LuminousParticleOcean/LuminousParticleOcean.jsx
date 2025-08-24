import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Helper function to convert hex color to rgba for CSS
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`; 
}

// Internal component to create and animate the flowing spheres
function FlowingSpheres({ count, sep, color, pushStrength }) {
    const instancedMeshRef = useRef();

    // A dummy object to reuse for matrix calculations for performance
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate the initial positions and data for each instance
    const particles = useMemo(() => {
        const temp = [];
        for (let xi = 0; xi < count; xi++) {
            for (let zi = 0; zi < count; zi++) {
                const x = sep * (xi - count / 2);
                const z = sep * (zi - count / 2);
                temp.push({ x, y: 0, z });
            }
        }
        return temp;
    }, [count, sep]);

    // useFrame runs on every rendered frame
    useFrame(({ clock, mouse }) => {
        if (!instancedMeshRef.current) return;
        const elapsedTime = clock.getElapsedTime();

        // Map mouse position (-1 to 1) to the grid's world coordinates
        const mouseXWorld = mouse.x * (count * sep / 4);
        const mouseZWorld = -mouse.y * (count * sep / 4);

        // Animate each sphere's y-position and update its matrix
        particles.forEach((particle, i) => {
            const { x, z } = particle;

            // --- 1. Wave Animation ---
            const timeFactor = Math.sin(elapsedTime * 0.5);
            const wave1 = Math.sin(x * 0.15 + timeFactor * Math.PI);
            const wave2 = Math.sin(z * 1 + timeFactor * Math.PI);
            let y = (wave1 + wave2) * 7;

            // --- 2. Mouse Movement Interaction ---
            const dx = x - mouseXWorld;
            const dz = z - mouseZWorld;
            const distance = Math.sqrt(dx * dx + dz * dz);

            const maxDist = 50; // The radius of the interaction effect

            const pushFactor = Math.max(0, 1 - distance / maxDist);
            const smoothPush = Math.pow(pushFactor, 3);

            y -= smoothPush * pushStrength;

            dummy.position.set(x, y, z);
            dummy.updateMatrix();

            instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
        });

        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group rotation={[0, 0, 0]}>
            <instancedMesh
                ref={instancedMeshRef}
                args={[null, null, count * count]}
            >
                <sphereGeometry args={[0.2, 19, 19]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    roughness={0.4}
                    metalness={0.1}
                />
            </instancedMesh>
        </group>
    );
}

// The main component, now named LuminousParticleOcean
// You can pass props to this component to customize the background
const LuminousParticleOcean = ({
    sphereCount = 100,
    sphereColor = "#00aaff",
    interactionStrength = 15,
    separation = 4,
    bgColor1 = "#010a2d",
    bgColor2 = "#001133",
    
}) => {

    const lightColorRgba = useMemo(() => hexToRgba(sphereColor, 0.5), [sphereColor]);

    return (
        <div
            className="relative w-screen h-[60vh] lg:h-[80vh] overflow-hidden"
            style={{
                background: `linear-gradient(to bottom, ${bgColor1}, ${bgColor2})`
            }}
        >
            {/* Sunlight Effect: Now uses the sphereColor prop */}
            <div
                className="absolute -top-10 left-0 w-full h-1/2 z-[999]"
                style={{
                    background: `radial-gradient(circle at top center, ${lightColorRgba} 0%, transparent 90%)`,
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }}
            />

            {/* Vignette Effect */}
            <div
                className="absolute inset-0"
                style={{
                    boxShadow: 'inset 0 0 150px rgba(0,0,0,0.7)',
                    pointerEvents: 'none',
                }}
            />

            <Canvas
                camera={{ position: [0, 60, 150], fov: 55 }}
            >
                {/* Sunlight: Also uses the sphereColor prop */}
                <pointLight
                    color={sphereColor}
                    intensity={4000}
                    distance={300}
                    position={[-150, 100, -100]}
                />
                <ambientLight intensity={0.2} />

                {/* Render the animated flowing spheres component with the passed props */}
                <FlowingSpheres
                    count={sphereCount}
                    sep={separation}
                    color={sphereColor}
                    pushStrength={interactionStrength}
                />
            </Canvas>
        </div>
    );
}

export default LuminousParticleOcean;