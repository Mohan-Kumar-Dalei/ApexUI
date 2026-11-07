/*
 * Builds the ApexUI agent skill.
 *  1. Writes skills/apexui/references/components.md from the real component list
 *     (names, categories and summaries from src/site/config/navigation.js, CLI
 *     names from the README table).
 *  2. Copies skills/apexui to the npm package (../v1/NPM/apex-ui-kit/src/skill/apexui)
 *     when it exists, so `npx apex-ui-kit skill` ships the same files.
 * Run: node scripts/build-skill.mjs
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const skillDir = new URL('skills/apexui/', root);
const nav = await readFile(new URL('src/site/config/navigation.js', root), 'utf8');
const readme = await readFile(new URL('README.md', root), 'utf8');

// Component pages: name, slug, category, summary.
const pages = [];
for (const block of nav.split(/\n\s*\{\s*\n/)) {
    const path = block.match(/path:\s*'\/components\/([^']+)'/)?.[1];
    if (!path || path.startsWith('docs/')) continue;
    const name = block.match(/name:\s*(['"])((?:\\.|(?!\1).)*)\1/)?.[2];
    const category = block.match(/category:\s*'([^']+)'/)?.[1] ?? 'Other';
    const summary = block.match(/summary:\s*(['"])((?:\\.|(?!\1).)*)\1/)?.[2]?.replace(/\\(.)/g, '$1') ?? '';
    pages.push({ name, path, category, summary });
}

// CLI names from the README table (a page can have several variants).
// Rows look like: | [Name](…/components/slug) | `npx apex-ui-kit add a` (+ `b`, `c`) |
const cli = new Map();
for (const m of readme.matchAll(/\| \[([^\]]+)\]\(https:\/\/apex-ui\.in\/components\/([a-z0-9-]+)\) \| `npx apex-ui-kit add ([a-z0-9-]+)`([^|\n]*)\|/g)) {
    const [, name, slug, cmd, extra] = m;
    if (!cli.has(slug)) cli.set(slug, []);
    for (const c of [cmd, ...[...extra.matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1])]) {
        if (!cli.get(slug).some((v) => v.cmd === c)) cli.get(slug).push({ name, cmd: c });
    }
}

const tick = '`';
const ORDER = ['Backgrounds', 'Text & Motion', 'Cards', 'Navigation', 'Buttons', 'Interactive', 'AI', 'Loaders', 'Maps'];
const cats = [...new Set([...ORDER, ...pages.map((p) => p.category)])].filter((c) => pages.some((p) => p.category === c));
const lines = [
    '# ApexUI components (optional)',
    '',
    `You do not need these to build a premium site: the directions and blueprints are enough. Use one or two when an interaction or motion piece truly serves the brand. ${pages.length} components; add one with ${tick}npx apex-ui-kit add <cli-name> --dir src --yes${tick} (it lands in ${tick}src/ApexUI-Kit/<Folder>/${tick}; import it from there). Read the component source before using it and pass your direction's colours to it.`,
];
const missing = [];
for (const c of cats) {
    lines.push('', `## ${c}`, '', '| Component | CLI name | What it is |', '| --- | --- | --- |');
    for (const p of pages.filter((x) => x.category === c)) {
        const variants = cli.get(p.path);
        if (!variants) missing.push(p.path);
        const names = (variants ? variants.map((v) => v.cmd) : [p.path]).map((n) => tick + n + tick).join(', ');
        lines.push(`| ${p.name} | ${names} | ${p.summary} |`);
    }
}
lines.push(
    '',
    '## Picking well',
    '',
    '- Luxury and editorial directions: prefer quiet pieces (Image Accordion, Image Compare, FAQ Accordion, Scroll Stack, Flip Clock, Magnetic Button, Toast Stack, Animated Tabs, Stepper, Swipe Cards, Coverflow 3D). They keep the page calm.',
    '- Glow and colour backgrounds (Aurora, Galaxy 3D, Warp Tunnel, Liquid Gradient, Horizon Glow, Sunrise, Lens Flare, Orbs) contain gradients. Do not use them in the luxury directions; at most one, only for a playful or tech brand that asked for it.',
    '- Text effects work best on short strings: a headline, a word that rotates, a stat that counts.',
    '- Product UI (dashboards, settings, forms): Animated Tabs, Sidebar Nav, Stepper, FAQ Accordion, Toast Stack, Command Palette.',
    '- AI products: AI Prompt Box or AI Model Prompt for input, AI Thinking and AI Response for output.',
    '',
);
await writeFile(new URL('references/components.md', skillDir), lines.join('\n'));

// Copy every skill folder (apexui plus the style skills) into the npm package.
const SKILLS = ['apexui', 'simplepremium', 'luxurypremium'];
if (existsSync(new URL('../v1/NPM/apex-ui-kit/package.json', root))) {
    const npmSkills = new URL('../v1/NPM/apex-ui-kit/src/skill/', root);
    await rm(npmSkills, { recursive: true, force: true });
    for (const name of SKILLS) {
        const to = new URL(`${name}/`, npmSkills);
        await mkdir(to, { recursive: true });
        await cp(new URL(`skills/${name}/`, root), to, { recursive: true });
    }
}

const refs = (await readdir(new URL('references/', skillDir))).sort();
console.log(`skill: ${pages.length} components (no README CLI row: ${missing.join(', ') || 'none'}), ${refs.length} references`);
