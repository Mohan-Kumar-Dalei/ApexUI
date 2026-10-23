import { cdn } from '../ui/cdn.js';

/*
 * Page templates assembled from ApexUI components. They are shown live on the
 * site; getting the source is a Pro feature (coming soon), so no code is
 * shown here.
 */

// Pages rewritten after their first upload use a -v2 file so the CDN cache refreshes.
const FRESH = new Set(['atlas', 'lumen', 'nova', 'pulse']);
const shot = (slug) => cdn(`/assets/templates/${slug}${FRESH.has(slug) ? '-v2' : ''}.png`, { w: 1200 });

export const TEMPLATE_CATEGORIES = ['All', 'Startup', 'Portfolio', 'Travel', 'Agency', 'Store', 'Event', 'Restaurant', 'Finance'];

export const TEMPLATES = [
    {
        slug: 'ridge',
        name: 'Ridge',
        kind: 'Mountain retreat',
        category: 'Travel',
        tagline: 'A sunrise between the peaks with pines and birds, trips, booking steps and reviews.',
        accent: '#ffb15c',
        image: shot('ridge'),
        components: ['Sunrise Background', 'Image Accordion', 'Rolling Counter', 'Stepper', 'Testimonials', 'FAQ Accordion'],
        load: () => import('./RidgeTemplate.jsx'),
    },
    {
        slug: 'obsidian',
        name: 'Obsidian',
        kind: 'Creative agency',
        category: 'Agency',
        badge: 'Award style',
        tagline: 'Huge type, a liquid 3D blob, pixel reveals and a magnetic cursor across the whole page.',
        accent: '#ff4d2e',
        image: shot('obsidian'),
        components: ['Magnetic Cursor', 'Liquid Blob 3D', 'Rotating Text', 'Pixel Transition', 'Proximity Text', 'Accordion Marquee', 'Hover Text'],
        load: () => import('./ObsidianTemplate.jsx'),
    },
    {
        slug: 'kai',
        name: 'Kai',
        kind: 'Developer portfolio',
        category: 'Portfolio',
        tagline: 'A particle name, a typing tagline, a tech stack band and projects with WebGL hover.',
        accent: '#22d3ee',
        image: shot('kai'),
        components: ['Particle Text', 'Typewriter Text', 'Crossed Marquee', 'Distortion Image', 'Star Border', 'Edge Glow Form'],
        load: () => import('./KaiTemplate.jsx'),
    },
    {
        slug: 'nova',
        name: 'Nova',
        kind: 'SaaS launch',
        category: 'Startup',
        tagline: 'A glowing hero, product shot, spotlight features, integrations, pricing and FAQ.',
        accent: '#f0abfc',
        image: shot('nova'),
        components: ['Horizon Glow', 'Spotlight Grid', 'Orbit Icons', 'Rolling Counter', 'Testimonials', 'Pricing Cards', 'FAQ Accordion'],
        load: () => import('./NovaTemplate.jsx'),
    },
    {
        slug: 'lumen',
        name: 'Lumen',
        kind: 'App launch',
        category: 'Startup',
        tagline: 'An iOS style Liquid Glass nav, buttons and widget over a photo, then a 3D carousel.',
        accent: '#93c5fd',
        image: shot('lumen'),
        components: ['Liquid Glass', 'Circular Carousel', 'Accordion Marquee', 'Galaxy 3D', 'Magnetic Button'],
        load: () => import('./LumenTemplate.jsx'),
    },
    {
        slug: 'atlas',
        name: 'Atlas',
        kind: 'Travel photography',
        category: 'Travel',
        tagline: 'A full-bleed photo hero, destinations, a draggable archive and a page-scroll card stack.',
        accent: '#fdba74',
        image: shot('atlas'),
        components: ['Image Accordion', 'Infinite Canvas', 'Scroll Stack', 'Arc Gallery', 'Blur Reveal Text'],
        load: () => import('./AtlasTemplate.jsx'),
    },
    {
        slug: 'bloom',
        name: 'Bloom',
        kind: 'Product store',
        category: 'Store',
        tagline: 'A glass lens hero, add to bag toasts, a lookbook coverflow and swipe to like.',
        accent: '#ff6a3d',
        image: shot('bloom'),
        components: ['Glass Lens', 'Toast Stack', 'Coverflow 3D', 'Swipe Cards', 'Card Swap 3D'],
        load: () => import('./BloomTemplate.jsx'),
    },
    {
        slug: 'pulse',
        name: 'Pulse',
        kind: 'AI startup',
        category: 'Startup',
        tagline: 'A 1-bit dithered hero with a prompt box, voice mode, a 3D wall and a command palette.',
        accent: '#c8f560',
        image: shot('pulse'),
        components: ['Dither Waves', 'AI Prompt Box', 'AI Voice Orb', 'Marquee 3D', 'Command Palette', 'Scramble Text'],
        load: () => import('./PulseTemplate.jsx'),
    },
    {
        slug: 'orbit',
        name: 'Orbit Conf',
        kind: 'Conference',
        category: 'Event',
        tagline: 'A warp tunnel hero with a countdown, speakers, schedule, watch parties and tickets.',
        accent: '#a78bfa',
        image: shot('orbit'),
        components: ['Warp Tunnel', 'Flip Clock', 'Glitch Text', 'Bounce Cards', 'Stepper', 'Dot Globe', 'Star Border'],
        load: () => import('./OrbitTemplate.jsx'),
    },
    {
        slug: 'saffron',
        name: 'Saffron',
        kind: 'Restaurant',
        category: 'Restaurant',
        tagline: 'A warm photo hero, a menu accordion, an auto scrolling dish arc and a printing receipt.',
        accent: '#f5b041',
        image: shot('saffron'),
        components: ['Image Accordion', 'Arc Gallery', 'Receipt Printer', 'Stepper', 'Blur Reveal Text'],
        load: () => import('./SaffronTemplate.jsx'),
    },
    {
        slug: 'vault',
        name: 'Vault',
        kind: 'Fintech',
        category: 'Finance',
        tagline: 'A dot globe with money routes, a metal card with glare, features and an aurora finale.',
        accent: '#34d399',
        image: shot('vault'),
        components: ['Dot Globe', 'Glare Card', 'Rolling Counter', 'Spotlight Grid', 'Aurora Background', 'FAQ Accordion'],
        load: () => import('./VaultTemplate.jsx'),
    },
];
