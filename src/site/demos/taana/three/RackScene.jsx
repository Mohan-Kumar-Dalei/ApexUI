import { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';
import { reduced } from '../lib.jsx';
import { sareeTexture } from './textures.js';

/*
 * The rail from public/models/rack.glb, like a shop rail: sarees folded over wooden
 * hangers, spaced apart, the one in the middle a little larger. The rail stretches to
 * fit the sarees that are on it; drag (or the arrows) to walk along it. Hover brings a
 * saree forward, click calls onSelect. Sarees not in `visible` slide off the end.
 */

const RAIL_Y = 1.75;
const GAP = 0.66; // metres between hangers
const VIEW = 6.2; // hangers across the screen on desktop

export default function RackScene({ ref, products, visible, onHover, onSelect, onPan, className = '' }) {
    const host = useRef(null);
    const api = useRef({});
    const cb = useRef({ onHover, onSelect, onPan });
    cb.current = { onHover, onSelect, onPan };
    useImperativeHandle(ref, () => ({ pan: (dir) => api.current.pan?.(dir) }), []);

    useEffect(() => {
        const el = host.current;
        const still = reduced();

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 40);
        // studio light: a big soft key from the front left, a warm fill, a rim from behind
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#D9CBB8', 1.7));
        const key = new THREE.DirectionalLight('#FFF4E6', 2.3);
        key.position.set(-1.2, 3, 4);
        key.castShadow = true;
        key.shadow.mapSize.set(2048, 2048);
        Object.assign(key.shadow.camera, { left: -6, right: 6, top: 3, bottom: -1 });
        key.shadow.radius = 10;
        key.shadow.bias = -0.0005;
        scene.add(key);
        scene.add(key.target);
        const rim = new THREE.DirectionalLight('#FFE3BF', 1.1);
        rim.position.set(2, 2, -3);
        scene.add(rim);
        // a wall behind that only catches a soft shadow
        const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 8), new THREE.ShadowMaterial({ opacity: 0.05 }));
        wall.position.set(0, 1.5, -0.55);
        wall.receiveShadow = true;
        scene.add(wall);

        const items = new Map(); // slug -> { group, cloth, product, index }
        let rail = null;
        let railLen = 4.2;
        let hovered = null;
        let focus = null;
        const cam = { x: 0, target: 0, min: 0, max: 0 };

        const viewWidth = () => (el.clientWidth < 700 ? 2.2 : el.clientWidth < 1100 ? 4 : VIEW) * GAP + 0.5;
        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            // fit the visible stretch of rail across, and rod to hem top to bottom
            camera.position.z = Math.max(viewWidth() / (2 * t * camera.aspect), 1.45 / (2 * t));
            camera.position.y = 1.26;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);
        size();

        // Spread the visible sarees along a rail sized to fit them; the rest slide off.
        const layout = (slugs, instant = false) => {
            const shown = products.filter((p) => slugs.includes(p.slug));
            const span = Math.max(shown.length - 1, 0) * GAP;
            railLen = span + 0.7;
            const d = instant || still ? 0 : 0.9;
            if (rail) {
                // the rod model is 4.2 m: stretch it and move the end balls with it
                gsap.to(rail.rod.scale, { x: railLen / 4.2, duration: d, ease: 'expo.out' });
                gsap.to(rail.left.position, { x: rail.lx + (2.1 - railLen / 2), duration: d, ease: 'expo.out' });
                gsap.to(rail.right.position, { x: rail.rx + (railLen / 2 - 2.1), duration: d, ease: 'expo.out' });
            }
            const half = Math.max(0, (span - viewWidth() + 0.6) / 2);
            cam.min = -half;
            cam.max = half;
            cam.target = 0;
            products.forEach((p) => {
                const it = items.get(p.slug);
                if (!it) return;
                const i = shown.indexOf(p);
                if (i >= 0) {
                    it.group.visible = true;
                    gsap.to(it.group.position, { x: -span / 2 + i * GAP, duration: d, ease: 'expo.out', delay: d ? i * 0.03 : 0 });
                    gsap.to(it.group.scale, { x: 1, y: 1, z: 1, duration: d, ease: 'expo.out' });
                } else {
                    gsap.to(it.group.position, { x: railLen / 2 + 1.5, duration: d * 0.8, ease: 'expo.in' });
                    gsap.to(it.group.scale, { x: 0.001, y: 0.001, z: 0.001, duration: d * 0.8, ease: 'expo.in', onComplete: () => (it.group.visible = false) });
                }
            });
            cb.current.onPan?.({ canLeft: false, canRight: cam.max > 0 });
        };
        api.current.layout = layout;
        api.current.pan = (dir) => {
            cam.target = THREE.MathUtils.clamp(cam.target + dir * GAP * 3, cam.min, cam.max);
            cb.current.onPan?.({ canLeft: cam.target > cam.min + 0.01, canRight: cam.target < cam.max - 0.01 });
        };

        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        let disposed = false;
        loader.load('/demos/taana/models/rack.glb', (gltf) => {
            if (disposed) return;
            const parts = {};
            gltf.scene.children.slice().forEach((o) => (parts[o.name] = o));
            ['Rail_Rod', 'Rail_End_L', 'Rail_End_R'].forEach((n) => {
                parts[n].castShadow = true;
                scene.add(parts[n]);
            });
            // the rod lies along x around x = 0, so scaling a wrapper on x lengthens it
            const rod = new THREE.Group();
            scene.add(rod);
            rod.add(parts.Rail_Rod);
            rail = { rod, left: parts.Rail_End_L, right: parts.Rail_End_R, lx: parts.Rail_End_L.position.x, rx: parts.Rail_End_R.position.x };

            const hangerParts = ['Hanger_Hook', 'Hanger_Neck', 'Hanger_Bar', 'Hanger_End_L', 'Hanger_End_R'].map((n) => parts[n]);
            products.forEach((p, index) => {
                const group = new THREE.Group();
                group.position.set(railLen / 2 + 1.5, RAIL_Y, 0);
                group.scale.setScalar(0.001);
                group.visible = false;
                hangerParts.forEach((h) => {
                    const c = h.clone();
                    c.castShadow = true;
                    group.add(c);
                });
                const cloth = parts.Saree_Hung.clone();
                cloth.material = new THREE.MeshPhysicalMaterial({ map: sareeTexture(p.swatch), side: THREE.DoubleSide, roughness: 0.48, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color('#FFE6BF'), clearcoat: 0.08 });
                cloth.castShadow = true;
                cloth.receiveShadow = true;
                cloth.userData.slug = p.slug;
                group.add(cloth);
                scene.add(group);
                items.set(p.slug, { group, product: p, index, cloth });
            });
            layout(api.current.visible ?? products.map((p) => p.slug), false);
        });

        // pointer: hover forward, click to open, drag to walk along the rail
        const ray = new THREE.Raycaster();
        const ndc = new THREE.Vector2();
        const pick = (e) => {
            const r = renderer.domElement.getBoundingClientRect();
            ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
            ray.setFromCamera(ndc, camera);
            const cloths = [...items.values()].filter((i) => i.group.visible).map((i) => i.cloth);
            const hit = ray.intersectObjects(cloths, false)[0];
            return hit ? items.get(hit.object.userData.slug) : null;
        };
        let down = null;
        let dragged = false;
        const onDown = (e) => {
            down = { x: e.clientX, cam: cam.target };
            dragged = false;
        };
        const onMove = (e) => {
            if (down && e.buttons) {
                const dx = e.clientX - down.x;
                if (Math.abs(dx) > 6) dragged = true;
                const metresPerPx = viewWidth() / el.clientWidth;
                cam.target = THREE.MathUtils.clamp(down.cam - dx * metresPerPx, cam.min, cam.max);
                cb.current.onPan?.({ canLeft: cam.target > cam.min + 0.01, canRight: cam.target < cam.max - 0.01 });
                return;
            }
            const it = pick(e);
            if (hovered !== it) {
                hovered = it;
                renderer.domElement.style.cursor = it ? 'pointer' : 'grab';
                cb.current.onHover?.(it?.product ?? null);
            }
        };
        const onUp = (e) => {
            if (down && !dragged) {
                const it = pick(e);
                if (it) cb.current.onSelect?.(it.product);
            }
            down = null;
        };
        const onLeave = () => {
            down = null;
            if (hovered) cb.current.onHover?.(null);
            hovered = null;
        };
        const c = renderer.domElement;
        c.style.touchAction = 'pan-y';
        c.addEventListener('pointerdown', onDown);
        c.addEventListener('pointermove', onMove);
        c.addEventListener('pointerup', onUp);
        c.addEventListener('pointerleave', onLeave);

        let raf = 0;
        let onScreen = true;
        const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
        io.observe(el);
        const clock = new THREE.Clock();
        const frame = () => {
            raf = requestAnimationFrame(frame);
            if (!onScreen) return;
            const t = clock.getElapsedTime();
            cam.x += (cam.target - cam.x) * (still ? 1 : 0.08);
            camera.position.x = cam.x;
            camera.lookAt(cam.x, 1.2, 0);
            key.position.x = cam.x - 1.2;
            key.target.position.x = cam.x;
            // the saree nearest the middle of the view, or the one under the pointer, steps forward
            let near = null;
            let best = Infinity;
            items.forEach((it) => {
                if (!it.group.visible || it.group.scale.x < 0.9) return;
                const dist = Math.abs(it.group.position.x - cam.x);
                if (dist < best) {
                    best = dist;
                    near = it;
                }
            });
            focus = hovered ?? near;
            items.forEach((it) => {
                if (!it.group.visible || it.group.scale.x < 0.9) return;
                const on = it === focus;
                it.group.position.z += ((on ? 0.34 : 0) - it.group.position.z) * 0.1;
                const s = it.group.scale.x + ((on ? 1.12 : 1) - it.group.scale.x) * 0.1;
                it.group.scale.setScalar(s);
                if (!still) it.group.rotation.z = Math.sin(t * 0.8 + it.index * 1.9) * 0.008 + (on ? Math.sin(t * 1.6) * 0.012 : 0);
            });
            renderer.render(scene, camera);
        };
        frame();

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            c.removeEventListener('pointerdown', onDown);
            c.removeEventListener('pointermove', onMove);
            c.removeEventListener('pointerup', onUp);
            c.removeEventListener('pointerleave', onLeave);
            items.forEach((it) => {
                gsap.killTweensOf([it.group.position, it.group.scale]);
                it.cloth.material.dispose();
            });
            scene.traverse((o) => o.isMesh && o.geometry.dispose());
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [products]);

    // filter changes slide hangers on and off
    useEffect(() => {
        api.current.visible = visible;
        api.current.layout?.(visible);
    }, [visible]);

    return <div ref={host} className={`[&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}
