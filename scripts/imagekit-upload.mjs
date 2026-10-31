/*
 * Uploads every image in public/ to ImageKit under the /apexui folder, keeping
 * the folder layout, so cdn('/assets/…') URLs in src/site/ui/cdn.js resolve.
 * Set IMAGEKIT_FOLDER to upload somewhere else.
 *
 *   IMAGEKIT_PRIVATE_KEY=private_xxx npm run images:upload
 *
 * Or let GitHub do it: add the IMAGEKIT_PRIVATE_KEY repository secret and run
 * the "Upload images to ImageKit" workflow (.github/workflows/imagekit-upload.yml).
 *
 * The private key is read from the environment only — never commit it.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const key = process.env.IMAGEKIT_PRIVATE_KEY;
if (!key) {
    console.error('Set IMAGEKIT_PRIVATE_KEY first, e.g. IMAGEKIT_PRIVATE_KEY=private_xxx npm run images:upload');
    process.exit(1);
}

const ROOT = path.resolve('public');
const FOLDER = (process.env.IMAGEKIT_FOLDER ?? '/apexui').replace(/\/+$/, '');
const IMAGE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');
// Same rule ImageKit applies to file names (see ikPath in src/site/ui/cdn.js).
const clean = (name) => name.replace(/[^A-Za-z0-9._-]/g, '_');

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (IMAGE.test(entry.name)) yield full;
    }
}

// What is already on ImageKit (path -> size). Unchanged files are skipped, so a
// run only uploads new or edited images instead of overwriting everything
// (every overwrite keeps an old version and counts toward the plan limits).
const existing = new Map();
for (let skip = 0; ; skip += 1000) {
    const res = await fetch(`https://api.imagekit.io/v1/files?type=file&limit=1000&skip=${skip}`, { headers: { Authorization: auth } });
    if (!res.ok) break;
    const page = await res.json();
    page.forEach((f) => existing.set(f.filePath, f.size));
    if (page.length < 1000) break;
}

let ok = 0;
let failed = 0;
let skipped = 0;
for await (const file of walk(ROOT)) {
    const rel = path.relative(ROOT, file).split(path.sep);
    const fileName = clean(rel.pop());
    const folder = [FOLDER, ...rel.map(clean)].join('/') || '/';
    const data = await readFile(file);
    if (existing.get(`${folder}/${fileName}`) === data.length && !process.env.FORCE) {
        skipped += 1;
        continue;
    }
    const form = new FormData();
    form.append('file', new Blob([data]), fileName);
    form.append('fileName', fileName);
    form.append('folder', folder);
    form.append('useUniqueFileName', 'false');
    form.append('overwriteFile', 'true');
    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'POST', headers: { Authorization: auth }, body: form });
    if (res.ok) {
        ok += 1;
        console.log('✓', `${folder}/${fileName}`);
    } else {
        failed += 1;
        console.error('✗', `${folder}/${fileName}`, res.status, await res.text());
    }
}
console.log(`\nDone: ${ok} uploaded, ${skipped} unchanged (skipped), ${failed} failed.`);
process.exit(failed ? 1 : 0);
