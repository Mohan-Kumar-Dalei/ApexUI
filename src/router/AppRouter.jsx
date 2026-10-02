import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsLayout from '../site/layout/DocsLayout.jsx';
import NotFound from '../site/pages/NotFound.jsx';

const HomePage = lazy(() => import('../site/pages/home/HomePage.jsx'));
const TemplatesSoon = lazy(() => import('../site/pages/TemplatesSoon.jsx'));

export default function AppRouter() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/templates-soon" element={<TemplatesSoon />} />
                <Route path="/components/*" element={<DocsLayout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
