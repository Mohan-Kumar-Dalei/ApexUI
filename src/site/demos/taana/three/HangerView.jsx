import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';
import { reduced } from '../lib.jsx';
import { sareeTexture } from './textures.js';

/*
 * One saree on its hanger, taken off the rail: it rises into place, sways a little,
 * and turns to show the back when `side` is "back". Uses the same rack.glb parts.
 */
const PARTS = ['Hanger_Hook', 'Hanger_Neck', 'Hanger_Bar', 'Hanger_End_L', 'Hanger_End_R'];

export default function HangerView({ swatch, side = 'front', className = '' }) {
    const host = useRef(null);
    const api = useRef({});

    useEffect(() => {
        const el = host.current;
        const still = reduced();
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        el.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(24, 1, 0.05, 20);
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#D9CBB8', 1.8));
        const key = new THREE.DirectionalLight('#FFF4E6', 2.4);
        key.position.set(-1, 2, 3);
        scene.add(key);
        const rim = new THREE.DirectionalLight('#FFE3BF', 1.2);
        rim.position.set(1.5, 1, -2);
        scene.add(rim);

        const turn = new THREE.Group(); // turns for front and back
        const lift = new THREE.Group(); // rises in, sways
        lift.add(turn);
        scene.add(lift);
        api.current.turn = turn;

        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            camera.position.set(0, -0.53, Math.max(1.26 / (2 * t), 0.78 / (2 * t * camera.aspect)));
            camera.lookAt(0, -0.53, 0);
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);
        size();

        let disposed = false;
        let cloth = null;
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        loader.load('/demos/taana/models/rack.glb', (gltf) => {
            if (disposed) return;
            const parts = {};
            gltf.scene.children.slice().forEach((o) => (parts[o.name] = o));
            PARTS.forEach((n) => turn.add(parts[n]));
            cloth = parts.Saree_Hung;
            cloth.material = new THREE.MeshPhysicalMaterial({ map: sareeTexture(swatch, { size: 1024 }), side: THREE.DoubleSide, roughness: 0.46, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color('#FFE6BF'), clearcoat: 0.08 });
            turn.add(cloth);
            if (!still) {
                // lifted off the rail: it drops into place and settles with a small swing
                gsap.fromTo(lift.position, { y: 0.45 }, { y: 0, duration: 1.1, ease: 'expo.out' });
                gsap.fromTo(lift.rotation, { z: 0.08 }, { z: 0, duration: 1.6, ease: 'elastic.out(1, 0.4)' });
            }
        });

        let raf = 0;
        const clock = new THREE.Clock();
        const frame = () => {
            raf = requestAnimationFrame(frame);
            const t = clock.getElapsedTime();
            if (!still) turn.rotation.z = Math.sin(t * 1.1) * 0.01;
            renderer.render(scene, camera);
        };
        frame();
        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
            gsap.killTweensOf([lift.position, lift.rotation, turn.rotation]);
            cloth?.material.dispose();
            scene.traverse((o) => o.isMesh && o.geometry.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [swatch]);

    useEffect(() => {
        const turn = api.current.turn;
        if (!turn) return;
        gsap.to(turn.rotation, { y: side === 'back' ? Math.PI : 0, duration: reduced() ? 0 : 1, ease: 'expo.inOut' });
    }, [side]);

    return <div ref={host} aria-hidden="true" className={`[&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}
