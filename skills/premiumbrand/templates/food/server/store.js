// A small JSON-file store for stock, orders and newsletter subscribers.
// Writes run one at a time, so two orders can never take the same stock.
import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './config.js';
import { PRODUCTS } from './catalogue.js';

const FILE = path.join(DATA_DIR, 'store.json');
mkdirSync(DATA_DIR, { recursive: true });

const fresh = () => ({
    stock: Object.fromEntries(PRODUCTS.flatMap((p) => p.sizes.map((s) => [`${p.slug}:${s.id}`, s.id === 'l' ? 120 : 400]))),
    orders: [],
    subscribers: [],
});

let db;
try {
    db = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : fresh();
} catch {
    db = fresh();
}
// stock for anything added to the catalogue since the file was written
for (const [k, v] of Object.entries(fresh().stock)) if (!(k in db.stock)) db.stock[k] = v;

const save = () => {
    writeFileSync(FILE + '.tmp', JSON.stringify(db, null, 1));
    renameSync(FILE + '.tmp', FILE);
};
save();

let chain = Promise.resolve();
export const tx = (fn) => {
    const run = chain.then(() => {
        const out = fn(db);
        save();
        return out;
    });
    chain = run.catch(() => {});
    return run;
};
export const read = () => db;
