import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { makeRenderer, studioEnvironment, makeBag, disposeScene, BAG_SIZES } from './kit.js';
import { reduced } from '../lib/motion.jsx';

/*
 * One pack lifted off the shelf: it drops into place, settles with a small swing and
 * turns to show the back when `side` is "back". Changing the size swaps the model.
 */
export default function LiftedView({ product, size = 'm', side = 'front', className = '' }) {
    const host = useRef(null);
    const api = useRef({});

    useEffect(() => {
        const el = host.current;
        const renderer = makeRenderer(el, { exposure: 1.08 });
        const scene = new THREE.Scene();
        scene.environment = studioEnvironment(renderer);
        scene.add(new THREE.HemisphereLight('#FFFFFF', '#D9CBB8', 1.1));
        const key = new THREE.DirectionalLight('#FFF4E6', 2.3);
        key.position.set(-1, 1.5, 2.5);
        scene.add(key);
        const rim = new THREE.DirectionalLight('#FFE3BF', 1.4);
        rim.position.set(1.5, 1, -2);
        scene.add(rim);
        const camera = new THREE.PerspectiveCamera(24, 1, 0.02, 20);
        const turn = new THREE.Group();
        const lift = new THREE.Group();
        lift.add(turn);
        scene.add(lift);
        api.current = { turn, lift, scene, current: null };

        const size_ = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const L = BAG_SIZES.l;
            camera.position.set(0, 0, Math.max((L.h * 1.15) / (2 * t), (L.w * 1.6) / (2 * t * camera.aspect)));
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(size_);
        ro.observe(el);
        size_();

        const still = reduced();
        let raf = 0;
        const clock = new THREE.Timer();
        const frame = () => {
            raf = requestAnimationFrame(frame);
            clock.update();
            const t = clock.getElapsed();
            if (!still) {
                lift.position.y += (Math.sin(t * 1.1) * 0.006 - lift.position.y) * 0.05;
                turn.rotation.z = Math.sin(t * 0.9) * 0.012;
            }
            renderer.render(scene, camera);
        };
        frame();
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            gsap.killTweensOf([lift.position, lift.rotation, turn.rotation]);
            disposeScene(scene, renderer);
        };
    }, []);

    // swap the pack when the flavour or size changes; drop it in with a swing
    useEffect(() => {
        const { turn, lift, current } = api.current;
        if (!turn) return;
        if (current) {
            turn.remove(current);
            current.traverse((o) => o.material?.dispose());
        }
        const bag = makeBag(product, size);
        turn.add(bag);
        api.current.current = bag;
        if (!reduced()) {
            gsap.fromTo(lift.position, { y: 0.16 }, { y: 0, duration: 1.1, ease: 'expo.out' });
            gsap.fromTo(lift.rotation, { z: 0.12 }, { z: 0, duration: 1.6, ease: 'elastic.out(1, 0.4)' });
        }
    }, [product, size]);

    useEffect(() => {
        const { turn } = api.current;
        if (!turn) return;
        gsap.to(turn.rotation, { y: side === 'back' ? Math.PI : 0, duration: reduced() ? 0 : 1, ease: 'expo.inOut' });
    }, [side]);

    return <div ref={host} aria-hidden="true" className={className} />;
}
