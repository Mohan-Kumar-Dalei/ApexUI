import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { chipGeometry, chipMaterial, disposeScene, makeBag, makeRenderer, studioEnvironment } from './kit.js';
import { reduced } from '../lib/motion.jsx';

/*
 * The scroll story's stage: one real-art bag that turns and dollies as the chapters go
 * by, with chips floating round it. Hotspots are points on the bag; every frame they are
 * projected to the screen and written straight to their DOM labels (no React render).
 *
 * progress.current: 0..4 across the four chapters (fractional while scrolling).
 */
export const POSES = [
    { ry: -0.55, rx: 0.12, rz: -0.32, z: 0, x: 0.06 }, // the bag, three quarters
    { ry: 0.08, rx: 0.02, rz: 0.04, z: 0.22, x: 0.03 }, // the potato, face on and closer
    { ry: 0.6, rx: -0.08, rz: 0.22, z: 0.08, x: 0.0 }, // the fry, turned the other way
    { ry: -0.2, rx: 0.3, rz: -0.12, z: 0.15, x: 0.05 }, // the seasoning, tipped forward
];

// hotspot anchors in the bag's own space (metres, front face at +z), per chapter
export const HOTSPOTS = [
    [
        [-0.07, 0.07, 0.035],
        [0.09, 0.16, 0.0],
        [0.03, -0.09, 0.04],
    ],
    [
        [-0.05, -0.06, 0.04],
        [0.06, 0.02, 0.04],
        [0.0, 0.12, 0.03],
    ],
    [
        [-0.08, 0.0, 0.035],
        [0.07, -0.08, 0.035],
        [0.04, 0.12, 0.03],
    ],
    [
        [-0.06, 0.1, 0.03],
        [0.07, 0.0, 0.04],
        [-0.02, -0.11, 0.035],
    ],
];

const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

export default function InsideScene({ product, progress, labels, className = '' }) {
    const host = useRef(null);
    const api = useRef({});

    useEffect(() => {
        const el = host.current;
        const still = reduced();
        const renderer = makeRenderer(el, { exposure: 1.08 });
        const scene = new THREE.Scene();
        scene.environment = studioEnvironment(renderer);
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#3A1010', 1.0));
        const key = new THREE.DirectionalLight('#FFF4E6', 2.4);
        key.position.set(-1, 1.4, 2);
        scene.add(key);
        const rim = new THREE.DirectionalLight('#FFD2A8', 1.8);
        rim.position.set(1.4, 0.8, -1.2);
        scene.add(rim);
        const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 20);

        const stage = new THREE.Group(); // where the bag sits on screen
        const turn = new THREE.Group(); // the chapter pose
        stage.add(turn);
        scene.add(stage);
        api.current = { turn, bag: null };

        const chips = [];
        const geos = [1, 2, 3, 4, 5].map((s) => chipGeometry(s, 0.034));
        for (let i = 0; i < 16; i++) {
            const m = new THREE.Mesh(geos[i % 5], chipMaterial(i % 4 ? undefined : '#B8361C'));
            m.userData = { x: (Math.random() - 0.5) * 1.6, y: (Math.random() - 0.5) * 0.9, z: -0.3 + Math.random() * 0.5, sp: 0.2 + Math.random() * 0.4, ph: Math.random() * 6 };
            scene.add(m);
            chips.push(m);
        }

        let wide = true;
        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            wide = camera.aspect > 1.1;
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            camera.position.set(0, 0, Math.max(0.62 / (2 * t), 0.5 / (2 * t * camera.aspect)));
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);
        size();

        const v = new THREE.Vector3();
        let raf = 0;
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(el);
        const clock = new THREE.Timer();
        let smooth = 0;
        const frame = () => {
            raf = requestAnimationFrame(frame);
            if (!visible) return;
            clock.update();
            const t = clock.getElapsed();
            const p = Math.min(3.999, Math.max(0, progress.current));
            smooth += (p - smooth) * (still ? 1 : 0.1);
            const i = Math.floor(smooth);
            const f = ease(smooth - i);
            const a = POSES[i];
            const b = POSES[Math.min(3, i + 1)];
            // the bag sits right of the text on wide screens, lower down on phones
            stage.position.set(wide ? 0.09 + lerp(a.x, b.x, f) : 0, wide ? 0 : -0.06, lerp(a.z, b.z, f));
            stage.scale.setScalar(wide ? 1 : 0.85);
            turn.rotation.set(lerp(a.rx, b.rx, f) + (still ? 0 : Math.sin(t * 0.8) * 0.03), lerp(a.ry, b.ry, f) + (still ? 0 : Math.sin(t * 0.5) * 0.05), lerp(a.rz, b.rz, f));
            chips.forEach((m) => {
                const u = m.userData;
                m.position.set(u.x + Math.sin(t * u.sp + u.ph) * 0.03, u.y + Math.cos(t * u.sp * 0.8 + u.ph) * 0.04 - (smooth - 2) * 0.05, u.z);
                m.rotation.set(t * u.sp * 1.4 + u.ph, t * u.sp + u.ph, u.ph);
            });
            renderer.render(scene, camera);

            // hotspots for the nearest chapter: project and place their labels
            const ch = Math.round(smooth);
            const list = labels.current;
            const r = el.getBoundingClientRect();
            HOTSPOTS.forEach((set, c) => {
                set.forEach((pt, k) => {
                    const node = list[c * 3 + k];
                    if (!node) return;
                    v.set(...pt);
                    turn.localToWorld(v);
                    v.project(camera);
                    const x = (v.x * 0.5 + 0.5) * r.width;
                    const y = (-v.y * 0.5 + 0.5) * r.height;
                    const on = c === Math.min(3, ch) && Math.abs(smooth - c) < 0.45;
                    node.style.transform = `translate(${x}px, ${y}px)`;
                    node.style.opacity = on ? '1' : '0';
                    node.style.pointerEvents = on ? 'auto' : 'none';
                });
            });
        };
        frame();
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            disposeScene(scene, renderer);
        };
    }, [progress, labels]);

    // swap the bag when the flavour on show changes
    useEffect(() => {
        const { turn, bag } = api.current;
        if (!turn || !product) return;
        if (bag) {
            turn.remove(bag);
            bag.traverse((o) => o.material?.dispose());
        }
        const next = makeBag(product, 'l');
        turn.add(next);
        api.current.bag = next;
    }, [product]);

    return <div ref={host} className={className} aria-hidden="true" />;
}
