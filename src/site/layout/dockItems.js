import { BookOpen, House, LayoutGrid, Layers } from 'lucide-react';

/* Primary destinations shared by the desktop dock and the mobile bar. */
export const DOCK_ITEMS = [
    { label: 'Home', to: '/', icon: House, match: (p) => p === '/' },
    { label: 'Components', to: '/components', icon: LayoutGrid, match: (p) => p.startsWith('/components') && !p.startsWith('/components/docs') },
    { label: 'Docs', to: '/components/docs/getting-started/introduction', icon: BookOpen, match: (p) => p.startsWith('/components/docs') },
    { label: 'Templates', to: '/templates-soon', icon: Layers, match: (p) => p.startsWith('/templates') },
];
