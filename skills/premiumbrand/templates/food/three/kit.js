import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
 * Everything 3D in the store is modelled here in code, at real-world scale (metres):
 * a pillow-shaped foil chip bag with crimped seals, and a saddle-shaped chip.
 * Labels are painted on canvases per flavour and pack size, then mapped onto the bag.
 */

export const BAG_SIZES = {
    s: { w: 0.15, h: 0.21, puff: 0.026, grams: '26 g' },
    m: { w: 0.19, h: 0.27, puff: 0.034, grams: '52 g' },
    l: { w: 0.24, h: 0.34, puff: 0.044, grams: '115 g' },
};
const SEAL = 0.075; // share of the height taken by each crimped seal

/* ---------------- renderer ---------------- */
export function makeRenderer(el, { alpha = true, shadows = false, exposure = 1.05, maxDpr = 2 } = {}) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha, powerPreference: 'high-performance' });
    const phone = matchMedia('(max-width: 700px)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, phone ? 1.5 : maxDpr));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    if (shadows) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
    }
    if (el) {
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        el.appendChild(renderer.domElement);
    }
    return renderer;
}

// A soft studio room for reflections on the foil.
export function studioEnvironment(renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return env;
}

export function disposeScene(scene, renderer) {
    scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
    });
    scene.environment?.dispose?.();
    renderer.dispose();
    renderer.forceContextLoss?.();
    renderer.domElement.remove();
}

// Fit a camera so a box of `w` by `h` metres stays in frame at any aspect ratio.
export function fitDistance(camera, w, h) {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return Math.max(w / (2 * t * camera.aspect), h / (2 * t));
}

/* ---------------- colour helpers ---------------- */
const shade = (hex, amt) => {
    const c = new THREE.Color(hex);
    const hsl = c.getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace);
    c.setHSL(hsl.h, hsl.s, THREE.MathUtils.clamp(hsl.l + amt, 0, 1), THREE.SRGBColorSpace);
    return '#' + c.getHexString(THREE.SRGBColorSpace);
};

/* ---------------- the bag ---------------- */
const geoCache = new Map();
export function bagGeometry(size = 'm') {
    if (geoCache.has(size)) return geoCache.get(size);
    const { w, h, puff } = BAG_SIZES[size];
    const front = new THREE.PlaneGeometry(w, h, 48, 72);
    const pos = front.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const u = x / w + 0.5;
        const v = y / h + 0.5;
        const vb = THREE.MathUtils.clamp((v - SEAL) / (1 - 2 * SEAL), 0, 1);
        const body = v > SEAL && v < 1 - SEAL;
        let z = 0;
        let nx = x;
        if (body) {
            const su = Math.max(0, Math.sin(Math.PI * u));
            const sv = Math.max(0, Math.sin(Math.PI * vb));
            z = puff * Math.pow(su, 0.55) * Math.pow(sv, 0.42);
            // foil wrinkles, strongest near the seals
            const nearSeal = 1 - sv;
            z += 0.0016 * Math.sin(u * 31 + v * 7) * Math.sin(u * 11 - v * 23) * (0.4 + nearSeal) * su;
            // the sides pull in a little as the bag fills with air
            nx = x * (1 - 0.045 * sv);
        } else {
            // crimped seal: fine ridges across the width
            z = 0.0007 * Math.sin(v * h * 2400);
        }
        pos.setXYZ(i, nx, y, z);
    }
    front.computeVertexNormals();
    const back = front.clone();
    back.rotateY(Math.PI);
    const pair = { front, back };
    geoCache.set(size, pair);
    return pair;
}

function wrap(g, text, maxW) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
        const t = line ? line + ' ' + w : w;
        if (g.measureText(t).width > maxW && line) {
            lines.push(line);
            line = w;
        } else line = t;
    }
    if (line) lines.push(line);
    return lines;
}

function drawSeals(g, W, H, colour) {
    const dark = shade(colour, -0.12);
    for (const [y0, y1] of [
        [0, H * SEAL],
        [H * (1 - SEAL), H],
    ]) {
        g.fillStyle = dark;
        g.fillRect(0, y0, W, y1 - y0);
        g.globalAlpha = 0.18;
        for (let x = 0; x < W; x += 9) {
            g.fillStyle = (x / 9) % 2 ? '#000' : '#fff';
            g.fillRect(x, y0, 4, y1 - y0);
        }
        g.globalAlpha = 1;
    }
    // a notch line where the seal meets the body
    g.fillStyle = 'rgba(0,0,0,0.18)';
    g.fillRect(0, H * SEAL - 3, W, 3);
    g.fillRect(0, H * (1 - SEAL), W, 3);
}

function drawChip(g, x, y, rx, ry, rot, seasoned) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    const grd = g.createRadialGradient(-rx * 0.3, -ry * 0.3, rx * 0.1, 0, 0, rx);
    grd.addColorStop(0, '#FBE08A');
    grd.addColorStop(0.7, '#EDB948');
    grd.addColorStop(1, '#C98A25');
    g.fillStyle = grd;
    g.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.2) {
        const k = 1 + 0.07 * Math.sin(a * 3 + rx) + 0.05 * Math.sin(a * 5 + ry);
        const px = Math.cos(a) * rx * k;
        const py = Math.sin(a) * ry * k;
        a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(150,90,20,0.55)';
    g.lineWidth = 3;
    g.stroke();
    // little fried blisters
    g.fillStyle = 'rgba(190,120,30,0.35)';
    for (let i = 0; i < 6; i++) {
        const a = i * 2.1 + rx;
        g.beginPath();
        g.ellipse(Math.cos(a) * rx * 0.5, Math.sin(a) * ry * 0.45, rx * 0.08, ry * 0.06, a, 0, Math.PI * 2);
        g.fill();
    }
    if (seasoned) {
        g.fillStyle = seasoned;
        for (let i = 0; i < 40; i++) {
            const a = i * 2.39996;
            const r = Math.sqrt(i / 40) * 0.85;
            g.fillRect(Math.cos(a) * rx * r, Math.sin(a) * ry * r, 4, 4);
        }
    }
    // a shine
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = 5;
    g.beginPath();
    g.ellipse(-rx * 0.15, -ry * 0.2, rx * 0.55, ry * 0.4, -0.3, Math.PI * 1.1, Math.PI * 1.55);
    g.stroke();
    g.restore();
}

const SEASONING = { 'magic-masala': '#B8361C', 'tomato-tango': '#C42B22', 'hot-sweet-chilli': '#A3241A', 'sizzling-hot': '#5A1A10', 'peri-peri': '#C9471A', 'chile-limon': '#6E9A1E', 'cream-onion': '#3E8A3A' };

export function drawWordmark(g, cx, cy, r) {
    // a sun badge with the wordmark across it
    g.fillStyle = '#FFFFFF';
    g.beginPath();
    g.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#F4C20D';
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
    // rays
    g.save();
    g.translate(cx, cy);
    g.fillStyle = 'rgba(227,169,10,0.55)';
    for (let i = 0; i < 24; i++) {
        g.rotate((Math.PI * 2) / 24);
        g.beginPath();
        g.moveTo(-r * 0.04, r * 0.55);
        g.lineTo(r * 0.04, r * 0.55);
        g.lineTo(0, r * 0.92);
        g.fill();
    }
    g.restore();
    g.fillStyle = '#D3262D';
    g.beginPath();
    g.ellipse(cx, cy, r * 1.25, r * 0.38, -0.12, 0, Math.PI * 2);
    g.fill();
    g.font = `italic 900 ${Math.round(r * 0.58)}px Fraunces`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineWidth = r * 0.05;
    g.strokeStyle = '#8E1B1B';
    g.save();
    g.translate(cx, cy);
    g.rotate(-0.12);
    g.strokeText("Lay's", 0, r * 0.03);
    g.fillStyle = '#FFFFFF';
    g.fillText("Lay's", 0, r * 0.03);
    g.restore();
}

const texCache = new Map();
function canvasTexture(c) {
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
}

export function bagFront(p, size = 'm') {
    const key = `f:${p.slug}:${size}`;
    if (texCache.has(key)) return texCache.get(key);
    const W = 768;
    const H = Math.round((W * BAG_SIZES[size].h) / BAG_SIZES[size].w);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = p.colour;
    g.fillRect(0, 0, W, H);
    // a soft printed glow behind the badge
    const glow = g.createRadialGradient(W / 2, H * 0.3, 10, W / 2, H * 0.3, W * 0.75);
    glow.addColorStop(0, shade(p.colour, 0.12));
    glow.addColorStop(1, p.colour);
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);
    drawSeals(g, W, H, p.colour);

    drawWordmark(g, W / 2, H * 0.27, W * 0.21);

    const light = p.text === 'light';
    const ink = light ? '#FFFFFF' : '#1B1410';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    let fs = W * 0.105;
    g.font = `800 ${fs}px Fraunces`;
    let lines = wrap(g, p.name, W * 0.8);
    if (lines.length > 2) {
        fs = W * 0.085;
        g.font = `800 ${fs}px Fraunces`;
        lines = wrap(g, p.name, W * 0.84);
    }
    g.fillStyle = ink;
    lines.forEach((l, i) => g.fillText(l, W / 2, H * 0.5 + i * fs * 1.02));
    const afterName = H * 0.5 + (lines.length - 1) * fs * 1.02;

    // fact pill
    g.font = `800 ${W * 0.034}px Manrope`;
    const fact = p.fact.toUpperCase().split('').join(String.fromCharCode(8202));
    const fw = g.measureText(fact).width + W * 0.08;
    const py = afterName + W * 0.06;
    g.fillStyle = light ? 'rgba(255,255,255,0.18)' : 'rgba(27,20,16,0.12)';
    g.beginPath();
    g.roundRect(W / 2 - fw / 2, py, fw, W * 0.07, W * 0.035);
    g.fill();
    g.fillStyle = ink;
    g.fillText(fact, W / 2, py + W * 0.047);

    // chips on the front
    const seasoned = SEASONING[p.slug];
    const cy = H * 0.78;
    const chips = [
        [-0.22, 0.02, 0.17, 0.12, -0.4],
        [0.2, 0.03, 0.16, 0.11, 0.5],
        [-0.02, -0.03, 0.2, 0.14, 0.1],
        [-0.1, 0.07, 0.15, 0.1, 0.9],
        [0.1, 0.08, 0.17, 0.11, -0.7],
    ];
    if (p.slug === 'peri-peri') chips.forEach((c2) => (c2[3] *= 0.9));
    chips.forEach(([dx, dy, rx, ry, rot]) => drawChip(g, W / 2 + dx * W, cy + dy * W, rx * W, ry * W, rot, seasoned));

    // veg mark and weight
    const m = W * 0.06;
    g.fillStyle = '#FFFFFF';
    g.fillRect(W - m * 2.3, H * SEAL + m * 0.5, m, m);
    g.strokeStyle = '#1E8E3E';
    g.lineWidth = 4;
    g.strokeRect(W - m * 2.3, H * SEAL + m * 0.5, m, m);
    g.fillStyle = '#1E8E3E';
    g.beginPath();
    g.arc(W - m * 1.8, H * SEAL + m, m * 0.28, 0, Math.PI * 2);
    g.fill();
    g.font = `800 ${W * 0.045}px Manrope`;
    g.textAlign = 'left';
    g.fillStyle = ink;
    g.fillText(BAG_SIZES[size].grams, W * 0.07, H * (1 - SEAL) - W * 0.05);

    const tex = canvasTexture(c);
    texCache.set(key, tex);
    return tex;
}

export function bagBack(p, size = 'm') {
    const key = `b:${p.slug}:${size}`;
    if (texCache.has(key)) return texCache.get(key);
    const W = 768;
    const H = Math.round((W * BAG_SIZES[size].h) / BAG_SIZES[size].w);
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = p.colour;
    g.fillRect(0, 0, W, H);
    drawSeals(g, W, H, p.colour);
    const x0 = W * 0.1;
    const y0 = H * 0.13;
    const pw = W * 0.8;
    const ph = H * 0.74;
    g.fillStyle = '#FFFDF6';
    g.beginPath();
    g.roundRect(x0, y0, pw, ph, 28);
    g.fill();
    g.fillStyle = '#1B1410';
    g.textAlign = 'left';
    g.font = `800 ${W * 0.06}px Fraunces`;
    g.fillText(p.name.length > 22 ? p.name.slice(0, 22).trim() + '.' : p.name, x0 + 36, y0 + W * 0.11);
    g.font = `800 ${W * 0.03}px Manrope`;
    g.fillStyle = '#B8862B';
    g.fillText('INGREDIENTS', x0 + 36, y0 + W * 0.19);
    g.fillStyle = '#3A2F27';
    g.font = `500 ${W * 0.034}px Manrope`;
    const ing = wrap(g, p.ingredients, pw - 72);
    ing.forEach((l, i) => g.fillText(l, x0 + 36, y0 + W * 0.24 + i * W * 0.048));
    let y = y0 + W * 0.3 + ing.length * W * 0.048;
    g.font = `800 ${W * 0.03}px Manrope`;
    g.fillStyle = '#B8862B';
    g.fillText('PER 30 G SERVING (SAMPLE)', x0 + 36, y);
    y += W * 0.03;
    g.font = `600 ${W * 0.034}px Manrope`;
    for (const [k, v] of [
        ['Energy', '160 kcal'],
        ['Protein', '2 g'],
        ['Carbohydrate', '15 g'],
        ['Fat', '10 g'],
        ['Sodium', '170 mg'],
    ]) {
        y += W * 0.058;
        g.fillStyle = '#3A2F27';
        g.textAlign = 'left';
        g.fillText(k, x0 + 36, y);
        g.textAlign = 'right';
        g.fillText(v, x0 + pw - 36, y);
        g.fillStyle = '#E4D8BE';
        g.fillRect(x0 + 36, y + W * 0.016, pw - 72, 2);
    }
    // barcode
    g.fillStyle = '#1B1410';
    let bx = x0 + 36;
    const by = y0 + ph - W * 0.2;
    for (let i = 0; i < 46; i++) {
        const bw = 2 + ((i * 7) % 5);
        if (i % 3 !== 1) g.fillRect(bx, by, bw, W * 0.1);
        bx += bw + 3;
    }
    g.textAlign = 'left';
    g.font = `600 ${W * 0.026}px Manrope`;
    g.fillStyle = '#6E6253';
    g.fillText('Concept label for a fan-made store.', x0 + 36, y0 + ph - W * 0.05);
    const tex = canvasTexture(c);
    texCache.set(key, tex);
    return tex;
}

export function foilMaterial(map) {
    return new THREE.MeshPhysicalMaterial({ map, metalness: 0.3, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1.1 });
}

/* ---------------- real pack art ----------------
 * Flavours with an `image` use the photographed pack art (front, edge to edge, crimps
 * included) instead of a painted label. Load them once with loadPackTextures() before
 * rendering; the bag keeps the art's own proportions. */
const PACK_RATIO = 0.623; // width / height of the pack art
const packTex = new Map();
export function loadPackTextures(products, onEach) {
    const loader = new THREE.TextureLoader();
    let done = 0;
    return Promise.all(
        products
            .filter((p) => p.image)
            .map((p) =>
                loader.loadAsync(p.image).then((t) => {
                    t.colorSpace = THREE.SRGBColorSpace;
                    t.anisotropy = 8;
                    const back = t.clone();
                    back.wrapS = THREE.RepeatWrapping;
                    back.repeat.x = -1; // the back faces the other way, so mirror it back to reading order
                    back.needsUpdate = true;
                    packTex.set(p.slug, { front: t, back });
                    onEach?.(++done);
                }),
            ),
    );
}
export const packArt = (slug) => packTex.get(slug);

function packGeometry(size) {
    const key = `${size}:pack`;
    if (!BAG_SIZES[key]) BAG_SIZES[key] = { ...BAG_SIZES[size], w: BAG_SIZES[size].h * PACK_RATIO };
    return bagGeometry(key);
}

// A bag as a Group: Bag_Front and Bag_Back meshes, bottom seal at y = 0 when `standing`.
export function makeBag(p, size = 'm', { standing = false, shadows = false } = {}) {
    const art = p.image && packTex.get(p.slug);
    const { front, back } = art ? packGeometry(size) : bagGeometry(size);
    const g = new THREE.Group();
    g.name = `Bag_${p.slug}`;
    const f = new THREE.Mesh(front, art ? foilMaterial(art.front) : foilMaterial(bagFront(p, size)));
    f.name = 'Bag_Front';
    const backMat = art ? foilMaterial(art.back) : foilMaterial(bagBack(p, size));
    if (art) backMat.color = new THREE.Color('#9C9C9C'); // the back reads darker, like the side away from the light
    const b = new THREE.Mesh(back, backMat);
    b.name = 'Bag_Back';
    [f, b].forEach((m) => {
        m.castShadow = shadows;
        m.receiveShadow = false;
        m.userData.slug = p.slug;
        if (standing) m.position.y = BAG_SIZES[size].h / 2;
        g.add(m);
    });
    return g;
}

/* ---------------- chips ---------------- */
export function chipGeometry(seed = 1, r = 0.032, { wavy = false } = {}) {
    const rings = 9;
    const segs = 36;
    const verts = [0, 0, 0];
    const uvs = [0.5, 0.5];
    const idx = [];
    const rnd = (n) => Math.sin(seed * 12.9898 + n * 78.233) * 0.5 + 0.5;
    const curl = 0.32 + rnd(1) * 0.25;
    const tilt = rnd(2) * Math.PI;
    for (let i = 1; i <= rings; i++) {
        const rho = i / rings;
        for (let j = 0; j < segs; j++) {
            const th = (j / segs) * Math.PI * 2;
            const k = 1 + 0.08 * Math.sin(3 * th + seed) + 0.05 * Math.sin(5 * th + seed * 2) + 0.03 * Math.sin(9 * th + seed * 3);
            const x = Math.cos(th) * rho * r * k * 1.12;
            const y = Math.sin(th) * rho * r * k * 0.92;
            const xr = x * Math.cos(tilt) - y * Math.sin(tilt);
            const yr = x * Math.sin(tilt) + y * Math.cos(tilt);
            let z = ((curl * (xr * xr - yr * yr)) / r) * 0.9;
            if (wavy) z += 0.0035 * Math.sin((yr / r) * 9);
            verts.push(x, y, z);
            uvs.push(x / (2.4 * r) + 0.5, y / (2.4 * r) + 0.5);
        }
    }
    for (let j = 0; j < segs; j++) idx.push(0, 1 + j, 1 + ((j + 1) % segs));
    for (let i = 1; i < rings; i++) {
        const a0 = 1 + (i - 1) * segs;
        const b0 = 1 + i * segs;
        for (let j = 0; j < segs; j++) {
            const j1 = (j + 1) % segs;
            idx.push(a0 + j, b0 + j, b0 + j1, a0 + j, b0 + j1, a0 + j1);
        }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
}

let chipTex = null;
export function chipTexture(seasoning) {
    const key = `chip:${seasoning || ''}`;
    if (texCache.has(key)) return texCache.get(key);
    const S = 256;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(S / 2, S / 2, 10, S / 2, S / 2, S / 2);
    grd.addColorStop(0, '#F8D57A');
    grd.addColorStop(0.75, '#EDBA4A');
    grd.addColorStop(1, '#C17F22');
    g.fillStyle = grd;
    g.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) {
        const a = i * 2.39996;
        const r = Math.sqrt(i / 70) * S * 0.45;
        g.fillStyle = i % 3 ? 'rgba(200,130,40,0.28)' : 'rgba(255,240,190,0.35)';
        g.beginPath();
        g.ellipse(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r, 3 + (i % 5), 2 + (i % 4), a, 0, Math.PI * 2);
        g.fill();
    }
    if (seasoning) {
        g.fillStyle = seasoning;
        for (let i = 0; i < 520; i++) {
            const a = i * 2.39996;
            const r = Math.sqrt(i / 520) * S * 0.48;
            g.globalAlpha = 0.5 + (i % 3) * 0.2;
            g.fillRect(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r, 2.5, 2.5);
        }
        g.globalAlpha = 1;
    }
    const tex = canvasTexture(c);
    texCache.set(key, tex);
    if (!seasoning) chipTex = tex;
    return tex;
}

export function chipMaterial(seasoning) {
    return new THREE.MeshPhysicalMaterial({ map: chipTexture(seasoning), side: THREE.DoubleSide, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.45, sheen: 0.4, sheenColor: new THREE.Color('#FFE2A0') });
}

export const SEASONINGS = SEASONING;
export const getChipTexture = () => chipTex;
