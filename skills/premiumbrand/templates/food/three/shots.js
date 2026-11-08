import * as THREE from 'three';
import { makeRenderer, studioEnvironment, makeBag, BAG_SIZES, disposeScene } from './kit.js';

/*
 * Product "photography" for the 2D parts of the page: each flavour's bag rendered
 * once from the same 3D model, on a transparent background, while the loader runs.
 * onProgress(0..1) feeds the loader's counter.
 */
export async function renderBagShots(products, { onProgress, width = 520 } = {}) {
    const height = Math.round(width * 1.42);
    const renderer = makeRenderer(null, { exposure: 1.05, maxDpr: 1 });
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    const scene = new THREE.Scene();
    scene.environment = studioEnvironment(renderer);
    scene.add(new THREE.HemisphereLight('#FFFFFF', '#E8D9BC', 1.1));
    const key = new THREE.DirectionalLight('#FFF3DF', 2.2);
    key.position.set(-0.6, 0.8, 1.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#FFE3BF', 1.4);
    rim.position.set(0.8, 0.4, -1);
    scene.add(rim);
    const camera = new THREE.PerspectiveCamera(22, width / height, 0.01, 10);
    const { h, w } = BAG_SIZES.m;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, Math.max((h * 1.12) / (2 * t), (w * 1.25) / (2 * t * camera.aspect)));
    camera.lookAt(0, 0, 0);

    const out = {};
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const bag = makeBag(p, 'm');
        bag.rotation.set(0.04, -0.28, 0.035);
        scene.add(bag);
        renderer.render(scene, camera);
        const blob = await new Promise((r) => renderer.domElement.toBlob(r, 'image/png'));
        out[p.slug] = blob ? URL.createObjectURL(blob) : renderer.domElement.toDataURL('image/png');
        scene.remove(bag);
        bag.traverse((o) => o.material?.dispose());
        onProgress?.((i + 1) / products.length);
        // let the loader paint between shots
        await new Promise((r) => requestAnimationFrame(r));
    }
    disposeScene(scene, renderer);
    return out;
}
