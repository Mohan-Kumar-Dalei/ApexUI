import { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { disposeScene, makeBag, makeRenderer, studioEnvironment, BAG_SIZES } from './kit.js';
import { reduced } from '../lib/motion.jsx';

/*
 * The Rack: every flavour hangs from a hook on one long chrome rod. `pos.current` is the
 * rail position in bags (0 = first bag in the middle); the camera eases to it. Moving the
 * pointer through the bags pushes them so they swing; a tap spins a bag on its hook.
 * Each frame the screen position of every bag's tag and caption is written to DOM nodes.
 */
const GAP = 0.36; // metres between hooks
const ROD_Y = 0.25;

export default function RackScene({ ref, products, pos, tags, onTap, className = '' }) {
    const host = useRef(null);
    const api = useRef({});
    const cbs = useRef({ onTap });
    cbs.current = { onTap };
    useImperativeHandle(ref, () => ({ spin: (i) => api.current.spin?.(i) }), []);

    useEffect(() => {
        const el = host.current;
        const still = reduced();
        const renderer = makeRenderer(el, { exposure: 1.08 });
        const scene = new THREE.Scene();
        scene.environment = studioEnvironment(renderer);
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#D8D0C4', 1.3));
        const key = new THREE.DirectionalLight('#FFF6EA', 2.0);
        key.position.set(-1, 1.2, 2);
        scene.add(key);
        const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 30);

        const n = products.length;
        const chrome = new THREE.MeshPhysicalMaterial({ color: '#E2E2E0', metalness: 1, roughness: 0.18 });
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, n * GAP + 8, 18), chrome);
        rod.rotation.z = Math.PI / 2;
        rod.position.set(((n - 1) * GAP) / 2, ROD_Y, 0);
        scene.add(rod);

        const H = BAG_SIZES.l.h;
        const bags = products.map((p, i) => {
            const pivot = new THREE.Group(); // swings from the hook
            pivot.position.set(i * GAP, ROD_Y, 0);
            const spin = new THREE.Group(); // turns on the hook when tapped
            pivot.add(spin);
            // the hook: a small chrome loop and a stem down to a clip on the top seal
            const hook = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.0022, 8, 24, Math.PI * 1.4), chrome);
            hook.rotation.set(0, Math.PI / 2, -0.4);
            hook.position.y = 0.004;
            spin.add(hook);
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.05, 8), chrome);
            stem.position.y = -0.022;
            spin.add(stem);
            const clip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.014, 0.012), new THREE.MeshPhysicalMaterial({ color: '#F4F2EE', roughness: 0.4 }));
            clip.position.y = -0.048;
            spin.add(clip);
            const bag = makeBag(p, 'l');
            bag.position.y = -0.05 - H / 2;
            bag.rotation.z = (i % 2 ? 1 : -1) * 0.04;
            bag.traverse((o) => (o.userData.index = i));
            spin.add(bag);
            scene.add(pivot);
            return { pivot, spin, bag, swing: 0, vel: 0, turn: 0 };
        });

        let narrow = false;
        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            narrow = camera.aspect < 0.9;
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const across = narrow ? 1.6 : 5.2; // bags visible across
            camera.position.z = Math.max((across * GAP) / (2 * t * camera.aspect), 0.62 / (2 * t));
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);
        size();

        // pointer: brushing through bags pushes them; a tap spins one
        const ray = new THREE.Raycaster();
        const ndc = new THREE.Vector2();
        let last = null;
        let downAt = null;
        const hitAt = (e) => {
            const r = renderer.domElement.getBoundingClientRect();
            ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
            ray.setFromCamera(ndc, camera);
            const h = ray.intersectObjects(bags.map((b) => b.bag), true)[0];
            return h ? h.object.userData.index : null;
        };
        const c = renderer.domElement;
        c.style.touchAction = 'pan-y';
        const onMove = (e) => {
            const i = hitAt(e);
            const vx = last ? e.clientX - last.x : 0;
            last = { x: e.clientX };
            if (i != null && !still) bags[i].vel += THREE.MathUtils.clamp(vx * 0.0016, -0.05, 0.05);
            c.style.cursor = i != null ? 'pointer' : 'grab';
        };
        const onDown = (e) => (downAt = { x: e.clientX, y: e.clientY });
        const onUp = (e) => {
            if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return (downAt = null);
            downAt = null;
            const i = hitAt(e);
            if (i != null) cbs.current.onTap?.(i);
        };
        c.addEventListener('pointermove', onMove);
        c.addEventListener('pointerdown', onDown);
        c.addEventListener('pointerup', onUp);
        api.current.spin = (i) => {
            if (bags[i]) bags[i].turn += Math.PI * 2;
        };

        const b0 = new THREE.Vector3();
        let camX = 0;
        let raf = 0;
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(el);
        const clock = new THREE.Timer();
        const frame = () => {
            raf = requestAnimationFrame(frame);
            if (!visible) return;
            clock.update();
            const t = clock.getElapsed();
            const want = THREE.MathUtils.clamp(pos.current, 0, n - 1) * GAP;
            camX += (want - camX) * (still ? 1 : 0.09);
            camera.position.x = camX;
            camera.position.y = narrow ? -0.02 : 0.0;
            camera.lookAt(camX, narrow ? -0.04 : 0.02, 0);
            bags.forEach((b, i) => {
                // a damped pendulum for the swing, plus a slow breath
                b.vel += -b.swing * 0.035;
                b.vel *= 0.94;
                b.swing += b.vel;
                b.pivot.rotation.z = b.swing + (still ? 0 : Math.sin(t * 0.9 + i) * 0.012);
                b.spin.rotation.y += (b.turn - b.spin.rotation.y) * 0.06;
            });
            renderer.render(scene, camera);

            // tags and captions follow their bags on screen
            const r = el.getBoundingClientRect();
            const list = tags.current;
            const half = (BAG_SIZES['l:pack']?.w ?? 0.2) / 2;
            const place = (node, x, y, z, i) => {
                if (!node) return;
                b0.set(x, y, z);
                bags[i].bag.localToWorld(b0);
                b0.project(camera);
                node.style.transform = `translate(${(b0.x * 0.5 + 0.5) * r.width}px, ${(-b0.y * 0.5 + 0.5) * r.height}px)`;
                node.style.setProperty('--dim', String(Math.max(0.22, 1 - Math.abs(i - camX / GAP) * 0.5)));
            };
            bags.forEach((_, i) => {
                const it = list[i];
                if (!it) return;
                place(it.tag, half, H / 2 - 0.035, 0.02, i); // number tag on the top corner
                place(it.cap, 0, -H / 2 - 0.02, 0, i); // caption under the bag
            });
        };
        frame();
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            c.removeEventListener('pointermove', onMove);
            c.removeEventListener('pointerdown', onDown);
            c.removeEventListener('pointerup', onUp);
            disposeScene(scene, renderer);
        };
    }, [products, pos, tags]);

    return <div ref={host} className={className} />;
}
