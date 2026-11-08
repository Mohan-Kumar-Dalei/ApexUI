# 3D: from model to scroll

## Pipeline
1. **Model.** With Tripo AI and Blender: generate, clean, retopologize, name the parts, export GLB. Without them: write the model in code with `templates/gltf-kit.mjs` (Three.js geometry in, named meshes out) the way `templates/build-rail.mjs` builds a rail, hanger and hung garment.
2. **Scale.** Real metres. A rail at 1.75 m, a hanger 0.5 m wide, a loom 1.9 m wide. It makes lighting and camera numbers predictable.
3. **Name every part** the code needs: `Rail_Rod`, `Hanger_Bar`, `Saree_Hung`, `Cloth_Woven`. The site finds parts by name.
4. **Keep UVs.** Run `prune({ keepAttributes: true })`, or the UVs vanish when the model has no texture yet and runtime textures render as one flat colour.
5. **Compress** with meshopt (`EXTMeshoptCompression` + `KHRMeshQuantization`). Aim for under 200 KB per model.
6. **Load** with `GLTFLoader` and `setMeshoptDecoder(MeshoptDecoder)`. Quantized nodes carry their own position and scale: clone nodes rather than rebuilding them, and move them by deltas.

## Runtime textures
Paint per-product surfaces on a canvas (`templates/textures.js`): body colour, a fine grain, small motifs, and a border along the hem (v = 0). Cache by colour. Pick the hue in sRGB (`color.getHSL(target, THREE.SRGBColorSpace)`); Three.js colours are linear, and hues read in linear space come out wrong. Light or gold bodies need a contrasting border so it still reads.

## Renderer settings that look premium
```js
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// cloth
new THREE.MeshPhysicalMaterial({ map, side: THREE.DoubleSide, roughness: 0.46, sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color('#FFE6BF') });
// a wall that only shows a soft shadow
new THREE.Mesh(new THREE.PlaneGeometry(40, 8), new THREE.ShadowMaterial({ opacity: 0.05 }));
```
Light: hemisphere (white over warm grey) plus a soft key from the front left that casts shadows, plus a warm rim from behind.

## Framing that survives every screen
Fit the camera to what must be seen, both ways:
```js
const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
camera.position.z = Math.max(visibleWidth / (2 * t * camera.aspect), visibleHeight / (2 * t));
```
On phones show fewer items across (about two on a rail) and let people drag.

## The pinned scroll scene
```jsx
// section N screens tall, canvas sticky, chapters scroll over it
const progress = useRef(0);
gsap.to(progress, { current: STATIONS.length - 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
// in the render loop: a CatmullRom path through the stations, eased
posCurve.getPoint(progress.current / (STATIONS.length - 1), wantPos);
pos.lerp(wantPos, 0.08);
camera.position.copy(pos);
camera.lookAt(look);
```

## The rail
`templates/RailScene.jsx`: clone the fixture and product per item, lay them out with GSAP (visible ones spread, hidden ones slide off and scale to 0), stretch the rod to fit, ease the camera along x for drag and arrows, bring the focused item forward. `templates/LiftedView.jsx`: the same parts in a separate small canvas for the detail view, dropping in with a swing and turning for Front / Back.

## Performance and care
- Lazy load every scene (`React.lazy`) so text and buttons paint first.
- Pause the render loop when the canvas is off screen (IntersectionObserver).
- Pixel ratio at most 2 (1.5 on phones); fewer segments on phones.
- Dispose geometries, materials, textures and the renderer on unmount.
- Reduced motion: render one still frame and jump the camera instead of gliding.
