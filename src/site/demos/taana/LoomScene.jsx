/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { reduced } from './lib.jsx';

/*
 * The loom room from public/models/loom.glb (phase 03 asset). Parts are found by name:
 * the woven cloth and the drape get the saree pattern, the warp gets thread stripes.
 * The camera travels through STATIONS; `progress.current` (0 to STATIONS.length - 1)
 * says where it should be, and GSAP sets that from the scroll.
 */

export const STATIONS = [
    { pos: [2.9, 1.95, 3.9], look: [0, 0.75, 0.2] }, // the room
    { pos: [0.35, 1.5, 1.15], look: [0, 0.86, 0.25] }, // the weave, close over the cloth
    { pos: [2.55, 1.15, 1.05], look: [1.7, 0.78, -0.3] }, // the thread stand
    { pos: [-1.55, 1.05, 3.05], look: [0.15, 0.25, 1.15] }, // the drape on the floor
];

function canvasTex(w, h, draw, repeat = [1, 1]) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
    t.anisotropy = 8;
    return t;
}

// Red silk with gold buttis and a zari border along one edge (v = 0).
function sareeTexture() {
    return canvasTex(1024, 1024, (g, W, H) => {
        const body = '#7E1416';
        const zari = '#C9A253';
        g.fillStyle = body;
        g.fillRect(0, 0, W, H);
        g.globalAlpha = 0.07;
        for (let x = 0; x < W; x += 3) {
            g.fillStyle = x % 6 ? '#000' : '#fff';
            g.fillRect(x, 0, 1, H);
        }
        g.globalAlpha = 1;
        for (let row = 0, y = 50; y < H - 250; row++, y += 74)
            for (let x = row % 2 ? 37 : 74; x < W; x += 74) {
                g.save();
                g.translate(x, y);
                g.fillStyle = zari;
                g.beginPath();
                g.moveTo(0, -11);
                g.quadraticCurveTo(8, 0, 0, 11);
                g.quadraticCurveTo(-8, 0, 0, -11);
                g.fill();
                g.restore();
            }
        const by = H - 220;
        g.fillStyle = zari;
        g.fillRect(0, by, W, 220);
        g.fillStyle = '#9C7A35';
        g.fillRect(0, by + 14, W, 5);
        g.fillRect(0, H - 26, W, 5);
        g.fillStyle = body;
        for (let x = 0; x < W; x += 52) {
            g.beginPath();
            g.moveTo(x + 6, by + 170);
            g.lineTo(x + 26, by + 70);
            g.lineTo(x + 46, by + 170);
            g.closePath();
            g.fill();
        }
    });
}

// Fine warp threads with gaps between them.
function warpTexture() {
    const t = canvasTex(512, 8, (g, W) => {
        g.clearRect(0, 0, W, 8);
        for (let x = 0; x < W; x += 4) {
            g.fillStyle = x % 16 === 0 ? '#E8C877' : '#C9A253';
            g.fillRect(x, 0, 2, 8);
        }
    });
    t.repeat.set(3, 1);
    return t;
}

export default function LoomScene({ progress, className = '', onReady }) {
    const host = useRef(null);
    const ready = useRef(onReady);

    useEffect(() => {
        const el = host.current;
        const still = reduced();
        const small = matchMedia('(max-width: 767px)').matches;

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor('#E7DCCB');
        renderer.domElement.setAttribute('aria-hidden', 'true');
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog('#E7DCCB', 7, 14);
        const camera = new THREE.PerspectiveCamera(small ? 50 : 38, 1, 0.05, 40);

        // warm daylight from the window, soft fill from the room
        scene.add(new THREE.HemisphereLight('#FFF4E2', '#6B4A2F', 1.1));
        const sun = new THREE.DirectionalLight('#FFE7C2', 3.2);
        sun.position.set(-2.4, 3.6, -1.2);
        sun.castShadow = true;
        sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
        sun.shadow.camera.left = -3;
        sun.shadow.camera.right = 3;
        sun.shadow.camera.top = 3;
        sun.shadow.camera.bottom = -3;
        sun.shadow.bias = -0.0004;
        sun.shadow.radius = 4;
        scene.add(sun);
        const fill = new THREE.PointLight('#FFD8A8', 2.2, 6, 1.6);
        fill.position.set(1.6, 1.8, 2.2);
        scene.add(fill);

        const textures = [];
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);
        let model = null;
        let disposed = false;
        loader.load('/demos/taana/models/loom.glb', (gltf) => {
            if (disposed) return;
            model = gltf.scene;
            const saree = sareeTexture();
            const warp = warpTexture();
            textures.push(saree, warp);
            model.traverse((o) => {
                if (!o.isMesh) return;
                o.castShadow = true;
                o.receiveShadow = true;
                if (o.name.startsWith('Room_')) o.castShadow = false;
                if (o.name === 'Cloth_Woven' || o.name === 'Saree_Drape') {
                    o.material = new THREE.MeshPhysicalMaterial({ map: saree, side: THREE.DoubleSide, roughness: 0.45, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color('#FFCF8A') });
                }
                if (o.name === 'Warp_Threads') {
                    o.material = new THREE.MeshStandardMaterial({ map: warp, alphaMap: warp, transparent: true, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.25 });
                    o.castShadow = false;
                }
                if (o.name === 'Room_Window') o.material = new THREE.MeshBasicMaterial({ color: '#FFF6E6' });
            });
            scene.add(model);
            ready.current?.();
        });

        const size = () => {
            const { width, height } = el.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            camera.updateProjectionMatrix();
        };
        size();
        const ro = new ResizeObserver(size);
        ro.observe(el);

        // A smooth path through the stations, so the camera glides instead of jumping.
        const posCurve = new THREE.CatmullRomCurve3(STATIONS.map((s) => new THREE.Vector3(...s.pos)), false, 'centripetal');
        const lookCurve = new THREE.CatmullRomCurve3(STATIONS.map((s) => new THREE.Vector3(...s.look)), false, 'centripetal');
        const pos = new THREE.Vector3();
        const look = new THREE.Vector3();
        const wantPos = new THREE.Vector3();
        const wantLook = new THREE.Vector3();
        const pointer = { x: 0, y: 0 };
        const aim = (t) => {
            posCurve.getPoint(t, wantPos);
            lookCurve.getPoint(t, wantLook);
        };
        aim(0);
        pos.copy(wantPos);
        look.copy(wantLook);

        const onMove = (e) => {
            pointer.x = (e.clientX / innerWidth - 0.5) * 2;
            pointer.y = (e.clientY / innerHeight - 0.5) * 2;
        };
        addEventListener('pointermove', onMove, { passive: true });

        let raf = 0;
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        io.observe(el);
        const clock = new THREE.Clock();
        const frame = () => {
            raf = requestAnimationFrame(frame);
            if (!visible) return;
            const t = clock.getElapsedTime();
            const p = progress?.current ?? 0;
            aim(Math.min(1, Math.max(0, p / (STATIONS.length - 1))));
            pos.lerp(wantPos, still ? 1 : 0.08);
            look.lerp(wantLook, still ? 1 : 0.08);
            camera.position.copy(pos);
            if (!still) {
                // a slow breath and a little parallax from the pointer
                camera.position.x += Math.sin(t * 0.3) * 0.03 + pointer.x * 0.08;
                camera.position.y += Math.sin(t * 0.4) * 0.02 - pointer.y * 0.05;
            }
            camera.lookAt(look);
            renderer.render(scene, camera);
        };
        frame();

        return () => {
            disposed = true;
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            removeEventListener('pointermove', onMove);
            textures.forEach((t) => t.dispose());
            scene.traverse((o) => {
                if (o.isMesh) {
                    o.geometry.dispose();
                    [].concat(o.material).forEach((m) => m.dispose());
                }
            });
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, [progress]);

    return <div ref={host} className={`[&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}
