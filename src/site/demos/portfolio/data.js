/* Content for the Ishaan Mehra portfolio demo. Plain data, so the page stays layout only. */

export const PERSON = {
    name: 'Ishaan Mehra',
    role: 'Frontend engineer',
    city: 'Pune, India',
    email: 'hello@ishaanmehra.dev',
    intro: 'I build fast, accessible interfaces for products people open every day. I lead the web team at Northline Payments and take on one outside project each quarter.',
    links: [
        ['GitHub', 'https://github.com'],
        ['LinkedIn', 'https://linkedin.com'],
        ['Read.cv', 'https://read.cv'],
    ],
};

export const SECTIONS = [
    ['about', 'About'],
    ['work', 'Work'],
    ['activity', 'Activity'],
    ['experience', 'Experience'],
    ['writing', 'Writing'],
    ['contact', 'Contact'],
];

// `look` picks the little interface drawn in the preview tile.
export const PROJECTS = [
    {
        title: 'Ledger rebuild',
        client: 'Northline Payments',
        year: '2025',
        text: 'Moved a 40-screen finance dashboard from a legacy SPA to React and Vite. First load went from 4.1s to 1.3s on a mid-range Android phone.',
        tags: ['React', 'TypeScript', 'Vite'],
        look: 'chart',
        tone: '#F2A541',
    },
    {
        title: 'Three-step train booking',
        client: 'Konkan Lines',
        year: '2024',
        text: 'Redesigned checkout with the product team. Seven screens became three, and completed bookings rose 18% in the first month.',
        tags: ['Next.js', 'Forms', 'A/B tests'],
        look: 'steps',
        tone: '#9CB89A',
    },
    {
        title: 'tiny-table',
        client: 'Open source',
        year: '2024',
        text: 'A 3 KB headless table hook with sorting, filters and virtual rows. Used in production by teams I have never met.',
        tags: ['TypeScript', 'Library'],
        look: 'code',
        tone: '#B9C3D6',
    },
    {
        title: 'Clinic scheduler',
        client: 'Drishti Eye Care',
        year: '2023',
        text: 'Offline-first booking app for 22 clinics. Front desks keep working when the network drops and sync when it comes back.',
        tags: ['PWA', 'IndexedDB', 'Service worker'],
        look: 'calendar',
        tone: '#D9A08B',
    },
    {
        title: 'Kiln design system',
        client: 'Studio Kiln',
        year: '2022',
        text: 'Sixty components with docs and visual tests for a team of thirty. Pull requests that touch UI now ship with screenshots by default.',
        tags: ['React', 'Storybook', 'Testing'],
        look: 'grid',
        tone: '#E4DFC9',
    },
];

export const COMMITS = [
    ['tiny-table', 'Keep sort order stable when a column has empty cells', '2 days ago', '+48 −12'],
    ['tiny-table', 'Virtual rows: measure once per resize, not per scroll', '5 days ago', '+31 −40'],
    ['dotfiles', 'Faster shell start, lazy load node version manager', '1 week ago', '+9 −22'],
    ['web-vitals-notes', 'Add INP field data from three client apps', '2 weeks ago', '+120 −4'],
];

export const JOBS = [
    ['2023 to now', 'Lead frontend engineer', 'Northline Payments', 'Pune'],
    ['2020 to 2023', 'Frontend engineer', 'Trailmate', 'Bengaluru'],
    ['2018 to 2020', 'Web developer', 'Studio Kiln', 'Pune'],
];

export const NOTES = [
    ['How we cut our dashboard load time by two thirds', 'Mar 2025', '9 min'],
    ['Forms that forgive: error messages people can act on', 'Nov 2024', '6 min'],
    ['A small checklist for keyboard users', 'Jun 2024', '4 min'],
];

export const STACK = [
    ['Daily', ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Playwright']],
    ['Often', ['Next.js', 'Node', 'PostgreSQL', 'Figma']],
    ['Care about', ['Core Web Vitals', 'Accessibility', 'Design systems']],
];
