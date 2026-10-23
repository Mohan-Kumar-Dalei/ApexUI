import { BookOpen, LayoutGrid, Layers } from 'lucide-react';

/* Primary destinations shown in the top navbar and the mobile drawer. */
export const NAV_ITEMS = [
    { label: 'Docs', to: '/components/docs/getting-started/introduction', icon: BookOpen, match: (p) => p.startsWith('/components/docs') },
    { label: 'Components', to: '/components', icon: LayoutGrid, match: (p) => p.startsWith('/components') && !p.startsWith('/components/docs') },
    { label: 'Templates', to: '/templates', icon: Layers, match: (p) => p.startsWith('/templates') },
];
