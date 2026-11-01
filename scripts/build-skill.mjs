/*
 * Builds the ApexUI agent skill.
 *  1. Writes skills/apexui/references/components.md from the real component list
 *     (names, categories and summaries from src/site/config/navigation.js, CLI
 *     names from the README table).
 *  2. Copies skills/apexui to public/skills/apexui (site downloads) and to the
 *     npm package (../v1/NPM/apex-ui-kit/src/skill/apexui) when it exists.
 *  3. Writes public/skills/apexui-skill.md: everything in one file, for chat
 *     apps that take a single upload (ChatGPT, Claude.ai projects, Gemini).
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
const cli = new Map();
// Rows look like: | [Name](…/components/slug) | `npx apex-ui-kit add a` (+ `b`, `c`) |
for (const m of readme.matchAll(/\| \[([^\]]+)\]\(https:\/\/apex-ui\.in\/components\/([a-z0-9-]+)\) \| `npx apex-ui-kit add ([a-z0-9-]+)`([^|\n]*)\|/g)) {
    const [, name, slug, cmd, extra] = m;
    if (!cli.has(slug)) cli.set(slug, []);
    for (const c of [cmd, ...[...extra.matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1])]) {
        if (!cli.get(slug).some((v) => v.cmd === c)) cli.get(slug).push({ name, cmd: c });
    }
}

const ORDER = ['Backgrounds', 'Text & Motion', 'Cards', 'Navigation', 'Buttons', 'Interactive', 'AI', 'Loaders', 'Maps'];
const cats = [...new Set([...ORDER, ...pages.map((p) => p.category)])].filter((c) => pages.some((p) => p.category === c));
let md = `# Components

${pages.length} ApexUI components. Add one with \`npx apex-ui-kit add <cli-name>\`; it lands in \`ApexUI-Kit/<Folder>/\`. Live demos and props: https://apex-ui.in/components/<page>.
Read the component source before using it: the props, their defaults and notes are at the top of the file.
`;
let missing = [];
for (const c of cats) {
    md += `\n## ${c}\n\n| Component | CLI name | What it is |\n| --- | --- | --- |\n`;
    for (const p of pages.filter((x) => x.category === c)) {
        const variants = cli.get(p.path);
        if (!variants) missing.push(p.path);
        const names = variants ? variants.map((v) => `\`${v.cmd}\``).join(', ') : `\`${p.path}\``;
        md += `| ${p.name} | ${names} | ${p.summary} |\n`;
    }
}
md += `
## Picking well

- One hero effect per page (a background, a 3D piece or a big text effect). Support it with 2 to 4 quieter pieces.
- Backgrounds that use WebGL (Aurora, Galaxy 3D, Warp Tunnel, Liquid Gradient, Dither Waves, Horizon Glow, Sunrise) are the heaviest: use one per page, never stack two.
- Text effects work best on short strings: a headline, a word that rotates, a stat that counts.
- For product UI (dashboards, settings, forms) prefer calm pieces: Animated Tabs, Sidebar Nav, Stepper, FAQ Accordion, Toast Stack, Command Palette.
- For mobile app screens: Floating Navbar or Magnify Dock style bottom bars, Swipe Cards, Card Stack, Toast Stack, Animated Switches.
- AI products: AI Prompt Box or AI Model Prompt for input, AI Thinking and AI Response for output, an AI Voice piece for voice mode.
`;
await writeFile(new URL('references/components.md', skillDir), md);

// Copies for the site and the npm package.
const publicDir = new URL('public/skills/apexui/', root);
await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
await cp(skillDir, publicDir, { recursive: true });
const npmDir = new URL('../v1/NPM/apex-ui-kit/src/skill/apexui/', root);
if (existsSync(new URL('../v1/NPM/apex-ui-kit/package.json', root))) {
    await rm(npmDir, { recursive: true, force: true });
    await mkdir(npmDir, { recursive: true });
    await cp(skillDir, npmDir, { recursive: true });
}

// All-in-one file.
const refs = (await readdir(new URL('references/', skillDir))).sort();
let all = (await readFile(new URL('SKILL.md', skillDir), 'utf8')).replace(/`references\/([a-z-]+)\.md`/g, 'the "$1" part below');
for (const f of refs) all += `\n\n---\n\n<!-- ${f} -->\n\n` + (await readFile(new URL(`references/${f}`, skillDir), 'utf8'));
await writeFile(new URL('public/skills/apexui-skill.md', root), all);

console.log(`skill: ${pages.length} components (no README CLI row: ${missing.join(", ") || "none"}), ${refs.length} references`);
