import { useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { chipGeometry, chipMaterial, disposeScene, makeBag, makeRenderer, studioEnvironment } from './kit.js';
import { reduced } from '../lib/motion.jsx';

/*
 * The hero carousel: one real-art 3D bag per flavour on an arc. The active bag stands in
 * the middle, the rest step back along the curve, turned outwards. Every frame each bag
 * eases toward its place on the arc, so changing `active` glides the whole ring round.
 * Drag or swipe to browse; click the middle bag to zoom; click a side bag to bring it in.
 */

// shortest signed distance round the ring
const wrap = (i, active, n) => {
    let o = i - active;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
};

function arcLayout(o, narrow) {
    const a = Math.abs(o);
    const step = narrow ? 0.2 : 0.26;
    return {
        x: Math.sin(o * 0.36) * (narrow ? 0.44 : 0.78),
        y: -Math.pow(a, 1.5) * 0.012 + (a === 0 ? 0.02 : 0),
        z: -(1 - Math.cos(o * 0.36)) * 1.15 - a * 0.05,
        ry: -o * step,
        rz: o * 0.07,
        s: a === 0 ? 1.18 : Math.max(0.5, 0.86 - a * 0.06),
        vis: a < 4.6 ? 1 : 0,
    };
}

export default function ArcScene({ ref, products, active, onPick, onDrag, zoom, className = '' }) {
    const host = useRef(null);
    const api = useRef({});
    const cbs = useRef({ onPick, onDrag });
    cbs.current = { onPick, onDrag };
    // the latest values, read when the scene mounts (it can mount after the carousel moved)
    const live = useRef({ active, zoom });
    live.current = { active, zoom };
    useImperativeHandle(ref, () => ({ nudge: (dx) => api.current.nudge?.(dx) }), []);

    useEffect(() => {
        const el = host.current;
        const still = reduced();
        const renderer = makeRenderer(el, { exposure: 1.06 });
        const scene = new THREE.Scene();
        scene.environment = studioEnvironment(renderer);
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#3A1010', 1.0));
        const key = new THREE.DirectionalLight('#FFF4E6', 2.2);
        key.position.set(-1, 1.4, 2);
        scene.add(key);
        const rim = new THREE.DirectionalLight('#FFE3BF', 1.5);
        rim.position.set(1.2, 0.6, -1.4);
        scene.add(rim);
        const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 20);

        const ring = new THREE.Group();
        scene.add(ring);
        const n = products.length;
        const bags = products.map((p, i) => {
            const hold = new THREE.Group();
            const bag = makeBag(p, 'l');
            hold.add(bag);
            bag.traverse((o) => (o.userData.index = i));
            ring.add(hold);
            // start already in place round the current flavour, no glide on mount
            return { hold, bag, pose: { ...arcLayout(wrap(i, live.current.active, products.length), innerWidth < 700) } };
        });

        // a few seasoned chips drifting round the middle bag
        const chips = [];
        const geos = [1, 2, 3, 4].map((s) => chipGeometry(s, 0.03));
        for (let i = 0; i < 9; i++) {
            const m = new THREE.Mesh(geos[i % 4], chipMaterial(i % 3 ? undefined : '#B8361C'));
            const a = (i / 9) * Math.PI * 2;
            m.userData = { a, r: 0.27 + (i % 3) * 0.06, y: (i % 4) * 0.07 - 0.1, sp: 0.15 + (i % 3) * 0.06, spin: 0.6 + (i % 5) * 0.3 };
            scene.add(m);
            chips.push(m);
        }

        let narrow = false;
        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            narrow = camera.aspect < 0.9;
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            // keep the middle bag about 60% of the height, and the arc inside the width
            camera.position.set(0, 0.02, Math.max(0.54 / (2 * t), (narrow ? 0.9 : 1.75) / (2 * t * camera.aspect)));
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size);
        ro.observe(el);
        size();

        // pointer: drag to browse, click to pick or zoom
        const ray = new THREE.Raycaster();
        const ndc = new THREE.Vector2();
        let down = null;
        let moved = false;
        let lean = { x: 0, y: 0 };
        const pick = (e) => {
            const r = renderer.domElement.getBoundingClientRect();
            ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
            ray.setFromCamera(ndc, camera);
            const hit = ray.intersectObjects(bags.map((b) => b.bag), true)[0];
            return hit ? hit.object.userData.index : null;
        };
        const c = renderer.domElement;
        c.style.touchAction = 'pan-y';
        c.style.cursor = 'grab';
        const onDown = (e) => {
            down = { x: e.clientX, y: e.clientY };
            moved = false;
        };
        const onMove = (e) => {
            const r = c.getBoundingClientRect();
            lean = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
            if (!down || !e.buttons) return;
            const dx = e.clientX - down.x;
            if (Math.abs(dx) > 50) {
                moved = true;
                cbs.current.onDrag?.(dx < 0 ? 1 : -1);
                down.x = e.clientX;
            }
        };
        const onUp = (e) => {
            if (down && !moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) {
                const i = pick(e);
                if (i != null) cbs.current.onPick?.(i);
            }
            down = null;
        };
        c.addEventListener('pointerdown', onDown);
        c.addEventListener('pointermove', onMove);
        addEventListener('pointerup', onUp);

        api.current = { bags, zoom: live.current.zoom ? 1 : 0, active: live.current.active };
        api.current.nudge = (dx) => cbs.current.onDrag?.(dx);

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
            const k = still ? 1 : 0.085;
            const act = api.current.active;
            bags.forEach((b, i) => {
                const o = wrap(i, act, n);
                const want = arcLayout(o, narrow);
                const z = o === 0 ? api.current.zoom : 0;
                for (const key2 of ['x', 'y', 'z', 'ry', 'rz', 's', 'vis']) b.pose[key2] += (want[key2] - b.pose[key2]) * k;
                b.hold.position.set(b.pose.x, b.pose.y + (o === 0 && !still ? Math.sin(t * 1.3) * 0.008 : 0), b.pose.z + z * 0.28);
                b.hold.rotation.set(o === 0 ? -lean.y * 0.15 : 0, b.pose.ry + (o === 0 ? lean.x * 0.35 + (still ? 0 : Math.sin(t * 0.7) * 0.05) : 0), b.pose.rz);
                b.hold.scale.setScalar(b.pose.s * (1 + z * 0.12));
                b.hold.visible = b.pose.vis > 0.05;
            });
            chips.forEach((m) => {
                const u = m.userData;
                const a = u.a + (still ? 0 : t * u.sp);
                m.position.set(Math.cos(a) * u.r * (narrow ? 0.7 : 1), u.y + Math.sin(t * 0.8 + u.a) * 0.02, Math.sin(a) * u.r * 0.5 + 0.05);
                m.rotation.set(t * u.spin, t * u.spin * 0.7, u.a);
            });
            renderer.render(scene, camera);
        };
        frame();
        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            c.removeEventListener('pointerdown', onDown);
            c.removeEventListener('pointermove', onMove);
            removeEventListener('pointerup', onUp);
            disposeScene(scene, renderer);
        };
    }, [products]);

    useEffect(() => {
        api.current.active = active;
    }, [active]);
    useEffect(() => {
        api.current.zoom = zoom ? 1 : 0;
    }, [zoom]);

    return <div ref={host} className={className} />;
}
