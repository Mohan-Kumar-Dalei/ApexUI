/*
 * Writes public/sitemap.xml from the real routes in src/site/config/navigation.js,
 * so every component and guide page is listed. Runs before each build
 * (see the "build" script in package.json); run it by hand with
 * `node scripts/generate-sitemap.mjs`.
 */
import { readFile, writeFile } from 'node:fs/promises';

const SITE_URL = 'https://apex-ui.in';
const nav = await readFile(new URL('../src/site/config/navigation.js', import.meta.url), 'utf8');
const docPaths = [...nav.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
const tpl = await readFile(new URL('../src/site/templates/index.js', import.meta.url), 'utf8');
const templateSlugs = [...tpl.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const today = new Date().toISOString().slice(0, 10);

const entries = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/components', priority: '0.9', changefreq: 'weekly' },
    { path: '/templates', priority: '0.8', changefreq: 'weekly' },
    ...templateSlugs.map((slug) => ({ path: `/templates/${slug}`, priority: '0.7', changefreq: 'monthly' })),
    ...docPaths.map((path) => ({
        path,
        priority: path.includes('/docs/') ? '0.7' : '0.8',
        changefreq: 'monthly',
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
        ({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>
`;

await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${entries.length} URLs`);
