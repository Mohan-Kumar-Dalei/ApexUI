import { lazy } from 'react';

/*
 * Demo sites built with the ApexUI skill. Each one is a full page, nav to footer,
 * with its own layout, code structure, page loader, skeleton state and motion.
 * image and poster are real screenshots of the demo (desktop 4:3, phone 4:5) in public/demos.
 */
export const DEMOS = [
    {
        slug: 'ishaan-mehra',
        name: 'Ishaan Mehra',
        kind: 'Developer portfolio',
        direction: 'Terminal paper',
        brief: 'A frontend engineer in Pune. Split screen with a sticky identity column, projects that preview under the cursor.',
        build: 'Terminal boot loader, commit list skeleton, scrambling text',
        image: '/demos/ishaan-mehra.jpg',
        poster: '/demos/ishaan-mehra-phone.jpg',
        Component: lazy(() => import('./portfolio/Portfolio.jsx')),
    },
    {
        slug: 'hinoki',
        name: 'Hinoki',
        kind: 'Omakase restaurant',
        direction: 'Lacquer dark',
        brief: 'A twelve-seat counter in Bandra. Courses scroll sideways, and the booking widget checks seats for the day you pick.',
        build: 'Ensō brush loader, seating skeleton, words that light up as you read',
        image: '/demos/hinoki.jpg',
        poster: '/demos/hinoki-phone.jpg',
        Component: lazy(() => import('./hinoki/Hinoki.jsx')),
    },
    {
        slug: 'kosh',
        name: 'Kosh',
        kind: 'Fintech product',
        direction: 'Clean ledger',
        brief: 'A money app for freelancers. The hero is the product itself, and every feature card can be tried.',
        build: 'Progress bar loader, full dashboard skeleton, stacked steps',
        image: '/demos/kosh.jpg',
        poster: '/demos/kosh-phone.jpg',
        Component: lazy(() => import('./kosh/Kosh.jsx')),
    },
    {
        slug: 'volta',
        name: 'Volta',
        kind: 'Streetwear store',
        direction: 'Colour block',
        brief: 'A Bengaluru label selling one drop at a time. Working cart, size quick add, a lookbook you drag.',
        build: 'Counter and colour wipe loader, product grid skeleton wave, drop countdown',
        image: '/demos/volta.jpg',
        poster: '/demos/volta-phone.jpg',
        Component: lazy(() => import('./volta/Volta.jsx')),
    },
];
