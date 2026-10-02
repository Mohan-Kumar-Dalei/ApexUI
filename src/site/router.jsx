import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import RouteError from './layout/RouteError.jsx';
import NotFound from './pages/NotFound.jsx';
import { allDocPages } from './config/navigation.js';

const INTRO = '/components/docs/getting-started/introduction';

/*
 * One data router for the whole site:
 * - every page is code-split and loaded by `lazy`, so navigation waits for the
 *   chunk (a top progress bar shows) instead of flashing a skeleton;
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
                        lazy: async () => ({ Component: (await import('./pages/home/HomePage.jsx')).default }),
                        handle: { title: 'ApexUI – Animated React components' },
                    },
                    {
                        path: 'templates-soon',
                        lazy: async () => ({ Component: (await import('./pages/TemplatesSoon.jsx')).default }),
                        handle: { title: 'Templates – ApexUI' },
                    },
                    {
                        path: 'components',
                        handle: { index: true },
                        children: [
                            {
                                index: true,
                                lazy: async () => ({ Component: (await import('./pages/ComponentsIndex.jsx')).default }),
                                handle: { title: 'Components – ApexUI', index: true },
                            },
                            // Short and legacy entry points.
                            { path: 'docs', element: <Navigate to={INTRO} replace /> },
                            { path: 'docs/getting-started', element: <Navigate to={INTRO} replace /> },
                            ...allDocPages.map((page) => ({
                                path: page.path.replace('/components/', ''),
                                lazy: async () => ({ Component: (await page.load()).default }),
                                handle: { title: `${page.name} – ApexUI`, page, index: true },
                            })),
                        ],
                    },
                    { path: 'docs', element: <Navigate to={INTRO} replace /> },
                    { path: '*', element: <NotFound />, handle: { title: 'Not found – ApexUI' } },
                ],
            },
        ],
    },
]);
