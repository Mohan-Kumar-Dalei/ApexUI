// Template from the Taana build: a cloth painted on a canvas per product colour. Swap the motifs for the brand's material.
import * as THREE from 'three';

/*
 * Saree cloth painted on a canvas: a body colour with small buttis and a zari border
 * along the hem (v = 0). Light bodies get a deeper border so the zari still reads.
 */
const cache = new Map();

function luminance(hex) {
    const c = new THREE.Color(hex);
    return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

export function sareeTexture(body = '#7E1416', { zari = '#C9A253', size = 512 } = {}) {
    const key = `${body}${zari}${size}`;
    if (cache.has(key)) return cache.get(key);
    // light bodies, and gold or yellow ones where zari would vanish, get a red border instead
    const goldish = new THREE.Color(body).getHSL({ h: 0, s: 0, l: 0 }, THREE.SRGBColorSpace);
    const light = luminance(body) > 0.55 || (goldish.h > 0.08 && goldish.h < 0.17 && goldish.s > 0.5);
    const motif = light ? '#B08A3E' : zari;
    const W = size;
    const H = size;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = body;
    g.fillRect(0, 0, W, H);
    // warp grain
    g.globalAlpha = 0.06;
    for (let x = 0; x < W; x += 2) {
        g.fillStyle = x % 4 ? '#000' : '#fff';
        g.fillRect(x, 0, 1, H);
    }
    g.globalAlpha = 1;
    // buttis in a half-drop grid, above the border
    const step = W / 9;
    for (let row = 0, y = step * 0.6; y < H * 0.74; row++, y += step)
        for (let x = row % 2 ? step / 2 : step; x < W; x += step) {
            g.fillStyle = motif;
            g.beginPath();
            g.moveTo(x, y - step * 0.16);
            g.quadraticCurveTo(x + step * 0.12, y, x, y + step * 0.16);
            g.quadraticCurveTo(x - step * 0.12, y, x, y - step * 0.16);
            g.fill();
        }
    // zari border at the bottom of the canvas (v = 0 with flipY)
    const by = H * 0.8;
    g.fillStyle = light ? '#8E1B1B' : zari;
    g.fillRect(0, by, W, H - by);
    g.fillStyle = light ? zari : '#9C7A35';
    g.fillRect(0, by + H * 0.015, W, H * 0.008);
    g.fillRect(0, H - H * 0.03, W, H * 0.008);
    g.fillStyle = light ? zari : body;
    const t = W / 18;
    for (let x = 0; x < W; x += t) {
        g.beginPath();
        g.moveTo(x + t * 0.12, H - H * 0.045);
        g.lineTo(x + t * 0.5, by + H * 0.04);
        g.lineTo(x + t * 0.88, H - H * 0.045);
        g.closePath();
        g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    cache.set(key, tex);
    return tex;
}
