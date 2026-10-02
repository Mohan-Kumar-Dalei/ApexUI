/*
 * Single source of truth for the docs: the sidebar, search, the component
 * gallery, prev/next links and the router all read from here.
 *
 * To add a component page: create `src/site/content/components/<Name>Doc.jsx`
 * (copy any existing one) and add an entry to `componentPages` below.
 * Each page module is loaded on demand through `load`.
 */

export const SITE = {
    name: 'ApexUI',
    version: 'v2.0.7',
    github: 'https://github.com/Mohan-Kumar-Dalei/ApexUI',
    npm: 'https://www.npmjs.com/package/apex-ui-kit',
    linkedin: 'https://www.linkedin.com/in/mohan-kumar-dalei/',
    instagram: 'https://www.instagram.com/_.apexui._/',
    privacy: 'https://apex-ui.notion.site/ApexUI-Privacy-Policy-23bcc7626dfc80aaad60f1033802579a',
    terms: 'https://apex-ui.notion.site/ApexUI-Terms-Conditions-23bcc7626dfc805c9271f18b9b7af916',
};

export const CATEGORIES = ['Backgrounds', 'Cards', 'Text & Motion', 'Navigation', 'Interactive'];

const shot = (file) => `/assets/componentsimage/${encodeURIComponent(file)}`;

export const guidePages = [
    {
        name: 'Introduction',
        path: '/components/docs/getting-started/introduction',
        load: () => import('../content/guides/Introduction.jsx'),
        section: 'Getting Started',
    },
    {
        name: 'React + Vite Setup',
        path: '/components/docs/getting-started/installation/react-setup',
        load: () => import('../content/guides/ReactViteSetup.jsx'),
        section: 'Installation',
    },
    {
        name: 'Tailwind Setup',
        path: '/components/docs/getting-started/installation/tailwind-setup',
        load: () => import('../content/guides/TailwindSetup.jsx'),
        section: 'Installation',
    },
    {
        name: 'ApexUI CLI Setup',
        path: '/components/docs/getting-started/installation/apexui-cli',
        load: () => import('../content/guides/CLISetup.jsx'),
        section: 'Installation',
    },
];

export const componentPages = [
    {
        name: 'Accordion Marquee',
        path: '/components/accordion-marquee',
        load: () => import('../content/components/AccordionMarqueeDoc.jsx'),
        badge: 'New',
        category: 'Text & Motion',
        image: shot('accordion-marquee.png'),
        summary: 'An interactive accordion with a smooth marquee effect on hover.',
    },
    {
        name: 'Avatar',
        path: '/components/avatar',
        load: () => import('../content/components/AvatarDoc.jsx'),
        category: 'Interactive',
        image: shot('Avatar.png'),
        summary: 'Display user avatars on their own or as an animated, stacked group.',
    },
    {
        name: 'Beam Bar',
        path: '/components/beam-bar',
        load: () => import('../content/components/BeamBarDoc.jsx'),
        category: 'Text & Motion',
        image: shot('BeamBar.png'),
        summary: 'An animated beam bar with a pulsing light for loading states and dashboards.',
    },
    {
        name: 'BluePrint Background',
        path: '/components/blueprint-background',
        load: () => import('../content/components/BluePrintBackgroundDoc.jsx'),
        badge: 'New',
        category: 'Backgrounds',
        image: shot('blueprint-background.png'),
        summary: 'An animated blueprint-style grid background with interactive hover effects.',
    },
    {
        name: 'Cards',
        path: '/components/cards',
        load: () => import('../content/components/CardsDoc.jsx'),
        badge: 'New',
        category: 'Cards',
        image: shot('meteor-card.png'),
        summary: 'Basic and meteor-shower cards for showcasing content with motion.',
    },
    {
        name: 'Card Stack',
        path: '/components/card-stack',
        load: () => import('../content/components/CardStackDoc.jsx'),
        category: 'Cards',
        image: shot('CardStack.png'),
        summary: 'A stack of cards that cycles automatically and pauses on hover.',
    },
    {
        name: 'Carousel',
        path: '/components/carousel',
        load: () => import('../content/components/CarouselDoc.jsx'),
        category: 'Interactive',
        image: shot('Carousel.png'),
        summary: 'Smooth, customizable carousels for showcasing images or content.',
    },
    {
        name: 'Edge Glow Form',
        path: '/components/edge-glow-form',
        load: () => import('../content/components/EdgeGlowFormDoc.jsx'),
        category: 'Interactive',
        image: shot('EdgeGlow Form.png'),
        summary: 'A form container that emits a soft gradient glow from its edges.',
    },
    {
        name: 'Glare Card',
        path: '/components/glare-card',
        load: () => import('../content/components/GlareCardDoc.jsx'),
        category: 'Cards',
        image: shot('GlareCard.png'),
        summary: "A card with a reflective glare that follows the user's cursor.",
    },
    {
        name: 'Hover Text',
        path: '/components/hover-text',
        load: () => import('../content/components/HoverTextDoc.jsx'),
        category: 'Text & Motion',
        image: shot('Animated Text.png'),
        summary: 'Interactive text hover effects that bring headings to life.',
    },
    {
        name: 'Hyper Card',
        path: '/components/hyper-card',
        load: () => import('../content/components/HyperCardDoc.jsx'),
        category: 'Cards',
        image: shot('HyperCard.png'),
        summary: 'A futuristic card with a starfield background and warp-speed hover.',
    },
    {
        name: 'Kinetic Threads Background',
        path: '/components/kinetic-threads-background',
        load: () => import('../content/components/KineticThreadsBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('Threads Background.png'),
        summary: 'A generative background of flowing, animated threads.',
    },
    {
        name: 'Lens Flare Background',
        path: '/components/lens-flare-background',
        load: () => import('../content/components/LensFlareBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('LensFlare Background.png'),
        summary: 'An animated lens flare that adds a cinematic touch to any hero.',
    },
    {
        name: 'Luminous Particle Ocean',
        path: '/components/luminous-particle-ocean',
        load: () => import('../content/components/LuminousParticleOceanDoc.jsx'),
        category: 'Backgrounds',
        image: shot('Ocean Background.png'),
        summary: 'A 3D ocean of glowing particles for immersive backgrounds.',
    },
    {
        name: 'Nav DropDown',
        path: '/components/nav-drop-down',
        load: () => import('../content/components/NavDropDownDoc.jsx'),
        category: 'Navigation',
        image: shot('DropMenu.png'),
        summary: 'A clean, accessible dropdown menu for navigation bars.',
    },
    {
        name: 'Nav Menu',
        path: '/components/nav-menu',
        load: () => import('../content/components/NavMenuDoc.jsx'),
        category: 'Navigation',
        image: shot('Nav Menu.png'),
        summary: 'Navigation with an animated active indicator.',
    },
    {
        name: 'Orbs Background',
        path: '/components/orbs-background',
        load: () => import('../content/components/OrbsBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('ObsBackground.png'),
        summary: 'Floating orbs that drift and react to the pointer.',
    },
    {
        name: 'Parallax Card',
        path: '/components/parallax-card',
        load: () => import('../content/components/ParallaxCardDoc.jsx'),
        category: 'Cards',
        image: shot('ParallaxCard.png'),
        summary: 'A card with a layered 3D parallax effect.',
    },
    {
        name: 'Pointer Follower',
        path: '/components/pointer-follower',
        load: () => import('../content/components/PointerFollowerDoc.jsx'),
        category: 'Interactive',
        image: shot('pointerFollwer.png'),
        summary: 'A pointer that follows the cursor and reveals content as it moves.',
    },
    {
        name: 'Profile',
        path: '/components/profile',
        load: () => import('../content/components/ProfileDoc.jsx'),
        category: 'Cards',
        image: shot('profile.png'),
        summary: 'Animated profile cards with flip and parallax variants.',
    },
    {
        name: 'Rain Background',
        path: '/components/rain-background',
        load: () => import('../content/components/RainBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('Rain background.png'),
        summary: 'Animated rainfall with collision detection.',
    },
    {
        name: 'Ripple Background',
        path: '/components/ripple-background',
        load: () => import('../content/components/RippleBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('Ripple Background.png'),
        summary: 'Soft, generative ripples that spread across the canvas.',
    },
    {
        name: 'Scroll Marquee',
        path: '/components/scroll-marquee',
        load: () => import('../content/components/ScrollMarqueeDoc.jsx'),
        category: 'Text & Motion',
        image: shot('Marquee.png'),
        summary: 'Text and card marquees whose speed follows the scroll.',
    },
    {
        name: 'Smart Grid Card',
        path: '/components/smart-grid-card',
        load: () => import('../content/components/SmartGridCardDoc.jsx'),
        category: 'Cards',
        image: shot('Grid Card.png'),
        summary: 'A responsive card grid with a spotlight that tracks the pointer.',
    },
    {
        name: 'Smoke Background',
        path: '/components/smoke-background',
        load: () => import('../content/components/SmokeBackgroundDoc.jsx'),
        category: 'Backgrounds',
        image: shot('Smoke background.png'),
        summary: 'A WebGL smoke simulation with dynamic lighting.',
    },
    {
        name: 'Testimonials',
        path: '/components/testimonials',
        load: () => import('../content/components/TestimonialsDoc.jsx'),
        category: 'Cards',
        image: shot('Testimonials.png'),
        summary: 'A testimonials section with smooth transitions between quotes.',
    },
    {
        name: 'Theme Toggle',
        path: '/components/theme-toggle',
        load: () => import('../content/components/ThemeToggleDoc.jsx'),
        category: 'Navigation',
        image: shot('Theme Toggle.png'),
        summary: 'A light/dark switch with view-transition reveal animations.',
    },
    {
        name: 'ToolTip',
        path: '/components/tool-tip',
        load: () => import('../content/components/ToolTipDoc.jsx'),
        category: 'Interactive',
        image: shot('ToolTip.png'),
        summary: 'Animated tooltips with smooth, physics-based positioning.',
    },
    {
        name: 'Water Drop Reveal',
        path: '/components/water-drop-reveal',
        load: () => import('../content/components/WaterDropRevealDoc.jsx'),
        category: 'Text & Motion',
        image: shot('WaterDrop hover.png'),
        summary: 'Text that reveals itself with a liquid water-drop effect.',
    },
];

// Keep components in the same order everywhere (index panel, grid, prev / next):
// grouped by category, alphabetical inside each group, numbered 01, 02 … in that order.
componentPages.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.name.localeCompare(b.name));
componentPages.forEach((page, i) => {
    page.num = String(i + 1).padStart(2, '0');
});
guidePages.forEach((page, i) => {
    page.num = String(i + 1).padStart(2, '0');
});

export const sidebarSections = [
    { title: 'Getting Started', items: guidePages.filter((p) => p.section === 'Getting Started') },
    { title: 'Installation', items: guidePages.filter((p) => p.section === 'Installation') },
    { title: 'Components', items: componentPages },
];

/* Reading order for prev / next links. */
export const allDocPages = [...guidePages, ...componentPages];

export const findPage = (pathname) => {
    const clean = pathname.replace(/\/+$/, '');
    return allDocPages.find((p) => p.path === clean) || null;
};

export const componentsByCategory = CATEGORIES.map((category) => ({
    category,
    items: componentPages.filter((p) => p.category === category),
}));

/* Warm a page's code before the user clicks (hover / focus). */
export const prefetch = (page) => {
    page?.load?.().catch(() => {});
};
