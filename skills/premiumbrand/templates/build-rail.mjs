// Template from the Taana build. Run from a scripts/ folder next to gltf-kit.mjs.
// Change the fixture (hanger, shelf, tray) and the hung product to fit the brand; keep the part names your scene looks for.
/*
 * Phase 03, second asset: the shop rail. A thin chrome rod, plus one wooden
 * hanger and one hung saree as templates. The site clones Hanger + Saree_Hung once per
 * product and paints each saree in its own colour.
 * Output: public/models/rack.glb
 *
 *   node scripts/build-rack.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THREE, makeDoc } from './gltf-kit.mjs';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'models', 'rack.glb');
const { mat, add, write, cyl } = makeDoc('Rail');

mat('Chrome', '#D9D9D6', 0.18, 1);
mat('WoodHanger', '#8A5A33', 0.55);
mat('Cloth', '#7E1416', 0.5, 0, true);

/* the rail: a thin chrome rod with ball ends, 4.2 m long (the site stretches it to fit) */
const RAIL_Y = 1.75;
add('Rail_Rod', cyl(0.011, 4.2, 20), 'Chrome', { pos: [0, RAIL_Y, 0], rot: [0, 0, Math.PI / 2] });
add('Rail_End_L', new THREE.SphereGeometry(0.024, 20, 14), 'Chrome', { pos: [-2.1, RAIL_Y, 0] });
add('Rail_End_R', new THREE.SphereGeometry(0.024, 20, 14), 'Chrome', { pos: [2.1, RAIL_Y, 0] });

/* template hanger: a wide wooden hanger with sloping shoulders and a chrome hook.
   The hook sits on the rail at y = 0 (moved to the rail at runtime). */
const SHOULDER = 0.25; // half width, metres
const TOP = -0.13; // shoulder peak, below the hook
const DROP = 0.085; // how far the shoulder ends fall
const shoulderY = (x) => TOP - (x / SHOULDER) ** 2 * DROP;
add('Hanger_Hook', new THREE.TorusGeometry(0.036, 0.005, 10, 32, Math.PI * 1.3), 'Chrome', { pos: [0, -0.006, 0], rot: [0, Math.PI / 2, -0.5] });
add('Hanger_Neck', cyl(0.005, 0.085, 10), 'Chrome', { pos: [0, -0.075, 0] });
{
    const pts = [];
    for (let i = 0; i <= 12; i++) {
        const x = -SHOULDER + (i / 12) * SHOULDER * 2;
        pts.push(new THREE.Vector3(x, shoulderY(x), 0));
    }
    add('Hanger_Bar', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.021, 14), 'WoodHanger');
    add('Hanger_End_L', new THREE.SphereGeometry(0.023, 16, 12), 'WoodHanger', { pos: [-SHOULDER, shoulderY(-SHOULDER), 0] });
    add('Hanger_End_R', new THREE.SphereGeometry(0.023, 16, 12), 'WoodHanger', { pos: [SHOULDER, shoulderY(SHOULDER), 0] });
}

/* template saree folded over the shoulders: a front layer and a longer back layer hang
   from the bar (its top half stays visible), with deep pleats and a flared, waving hem */
function layer(len, side, seed) {
    const W = SHOULDER * 2 - 0.02;
    const g = new THREE.PlaneGeometry(1, 1, 48, 110);
    const p = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) + 0.5;
        const k = 0.5 - p.getY(i); // 0 at the bar, 1 at the hem
        const x0 = (u - 0.5) * W;
        const flare = 1 + k * k * 0.42;
        const pleat = (Math.sin(u * Math.PI * 7 + seed) * 0.5 + 0.5) * 0.05 * (0.2 + k) + (Math.sin(u * Math.PI * 19 + seed) * 0.5 + 0.5) * 0.008 * k;
        const x = x0 * flare + Math.sin(k * 2.5 + seed) * 0.012 * k;
        const y = shoulderY(Math.max(-SHOULDER, Math.min(SHOULDER, x0))) - 0.004 - k * len + Math.sin(u * Math.PI * 8 + seed) * 0.014 * k * k;
        const z = side * (0.02 + pleat + k * 0.03);
        p.setXYZ(i, x, y, z);
        uv.setXY(i, u, 1 - k); // v = 0 at the hem, where the zari border is painted
    }
    return g;
}
{
    const { mergeGeometries } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
    const g = mergeGeometries([layer(0.74, 1, 0.4), layer(0.86, -1, 1.7)]);
    add('Saree_Hung', g, 'Cloth');
}

await write(OUT);
