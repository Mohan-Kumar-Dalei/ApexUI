import { lazy } from 'react';
import { photo } from './shared.jsx';

/* Demo sites built with the ApexUI skill. Each one is a full page, nav to footer. */
export const DEMOS = [
    {
        slug: 'maison-ivoire',
        name: 'Maison Ivoire',
        kind: 'Clothing store',
        direction: 'Atelier',
        brief: 'A small Porto label selling coats and knitwear online.',
        image: photo('photo-1539109136881-3be0616acf4b', 1400),
        Component: lazy(() => import('./StoreDemo.jsx')),
    },
    {
        slug: 'halden',
        name: 'Halden',
        kind: 'Photography portfolio',
        direction: 'Noir Gallery',
        brief: 'A two-person landscape and architecture studio in Oslo.',
        image: photo('photo-1493246507139-91e8fad9978e', 1400),
        Component: lazy(() => import('./PortfolioDemo.jsx')),
    },
    {
        slug: 'brasa',
        name: 'Brasa',
        kind: 'Restaurant',
        direction: 'Harbour',
        brief: 'A forty-seat charcoal grill in Lisbon with a private room.',
        image: photo('photo-1555939594-58d7cb561ad1', 1400),
        Component: lazy(() => import('./RestaurantDemo.jsx')),
    },
    {
        slug: 'stillwater',
        name: 'Stillwater',
        kind: 'Mobile app',
        direction: 'Calm pine (custom)',
        brief: 'A meditation app and its landing page. The phone in the hero is the working app.',
        image: photo('photo-1506126613408-eca07ce68773', 1400),
        Component: lazy(() => import('./AppDemo.jsx')),
    },
];
