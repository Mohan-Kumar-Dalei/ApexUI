# Food and snack playbook: 3D

Everything is modelled in code in `templates/food/three/kit.js` at real-world scale (metres). No GLB files are needed, so the scenes load as fast as the JS.

## The pack
- **Pillow bag.** `bagGeometry(size)` builds a puffed foil bag from a subdivided plane: the middle bulges by `puff`, the top and bottom `SEAL` (7.5% of the height each) are flat crimped seals. Sizes in `BAG_SIZES` (`s` 26 g, `m` 52 g, `l` 115 g). For a can, bottle or jar, swap only this function (a lathe for bottles and jars, a cylinder with rims for cans) and keep the rest.
- **Real art as the texture.** `loadPackTextures(products, onEach)` loads every `p.image` once (sRGB, anisotropy, mipmaps); `makeBag(p)` uses it when `p.image` is set. The bag takes the art's shape: its width is the height times `PACK_RATIO` (0.623 for a chip bag; measure the user's art). The back uses the same texture mirrored (`repeat.x = -1`) and tinted `#9C9C9C`, so it reads as the back without drawing anything.
- **Foil.** `foilMaterial(map)`: `MeshPhysicalMaterial`, metalness 0.3, roughness 0.34, clearcoat 1 for the shine, under `studioEnvironment()` (RoomEnvironment through PMREM).
- **Chips.** `chipGeometry(seed)` is a saddle-shaped disc with noise; `chipMaterial(seasoning)` paints a canvas with specks for each seasoning. Used by the loader, the storm and the Wall.

## The scenes
| Scene | File | What it does |
| --- | --- | --- |
| Hero arc | `ArcScene.jsx` | Bags on an arc; the active one large at the front, others step back by index distance and turn outwards. GSAP tweens positions on change; drag and click through a Raycaster; zoom moves the camera in. |
| Inside | `InsideScene.jsx` | One bag, `POSES[]` per chapter (rotation, position, distance) lerped by scroll progress; `HOTSPOTS[]` are bag-local points projected to screen each frame and written to label elements. |
| Rack | `RackScene.jsx` | A chrome rod with a hook per bag; position from `pos` (a ref, so drag never re-renders React). Pointer velocity near a bag adds swing (damped pendulum); tap spins one; tags and captions are placed from projected points. |
| Lifted | `LiftedView.jsx` | Small canvas for the detail: drops in with a swing, turns for front and back. |
| Shots | `shots.js` | Renders each bag once to a transparent PNG while the loader runs; the Wall, the tray and the basket use those images. |

## Rules
- Start scenes only after the loader is gone (`useRevealed()` from `lib/motion.jsx`), so the bag renders get the GPU first.
- One renderer per scene, `setPixelRatio(min(dpr, phone ? 1.5 : 2))`, pause when off screen, dispose everything on unmount (`disposeScene`).
- Keep labels in the DOM, not in WebGL text: they stay sharp, translatable and accessible.
- Reframe on phones with `fitDistance(camera, w, h)` so the pack stays in frame at any aspect ratio.
