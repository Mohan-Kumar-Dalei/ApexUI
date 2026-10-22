import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import RouteError from './layout/RouteError.jsx';
import NotFound from './pages/NotFound.jsx';
import { lazyPage } from './layout/lazyPage.jsx';
import { allDocPages, componentPages } from './config/navigation.js';

const INTRO = '/components/docs/getting-started/introduction';

/*
 * One data router for the whole site:
 * - every page is code-split; navigation is instant and a centered PageLoader
 *   (logo motion + a mini game) covers the download, see lazyPage;
 * - <ScrollRestoration> in AppShell restores scroll on back / forward;
 * - errorElement catches 404s and stale-chunk errors after a redeploy.
 */
export const router = createBrowserRouter([
    {
        element: <AppShell />,
        errorElement: <RouteError />,
        children: [
            {
                errorElement: <RouteError />,
                children: [
                    {
                        index: true,
                        element: lazyPage(() => import('./pages/home/HomePage.jsx')),
                        handle: {
                            title: 'ApexUI – Animated React Components for Tailwind CSS',
                            description: `Free, copy-paste animated React components built with Tailwind CSS, GSAP and Framer Motion. Add any of ${componentPages.length} components with one CLI command.`,
                        },
                    },
                    {
                        path: 'templates-soon',
                        element: lazyPage(() => import('./pages/TemplatesSoon.jsx')),
                        handle: { title: 'Templates – ApexUI', description: 'Ready-made ApexUI page templates for React and Tailwind CSS are on the way.' },
                    },
                    {
                        path: 'components',
                        handle: { index: true },
                        children: [
                            {
                                index: true,
                                element: lazyPage(() => import('./pages/ComponentsIndex.jsx')),
                                handle: {
                                    title: 'All Components – ApexUI React Component Library',
                                    description: `Browse ${componentPages.length} animated React components — backgrounds, cards, text effects, navigation and interactive UI — each with a live preview, props and a one-line install.`,
                                    index: true,
                                    sidebar: true,
                                },
                            },
                            // Short and legacy entry points.
                            { path: 'docs', element: <Navigate to={INTRO} replace /> },
                            { path: 'docs/getting-started', element: <Navigate to={INTRO} replace /> },
                            { path: 'water-drop-reveal', element: <Navigate to="/components/mask-view" replace /> },
                            { path: 'profile-card', element: <Navigate to="/components/profile" replace /> },
                            { path: 'webgl-carousel', element: <Navigate to="/components/3d-carousel" replace /> },
                            { path: 'hold-to-confirm', element: <Navigate to="/components/animated-buttons" replace /> },
                            ...allDocPages.map((page) => ({
                                path: page.path.replace('/components/', ''),
                                element: lazyPage(page.load),
                                handle: { title: `${page.name} – ApexUI`, page, index: true },
                            })),
                        ],
                    },
                    { path: 'docs', element: <Navigate to={INTRO} replace /> },
                    { path: '*', element: <NotFound />, handle: { title: 'Not found – ApexUI', noindex: true } },
                ],
            },
        ],
    },
]);
