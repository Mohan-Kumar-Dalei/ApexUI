import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { DEMOS } from '../demos/index.js';

/* One demo site, full page, without the ApexUI navbar. */
export default function DemoView() {
    const { slug } = useParams();
    const demo = DEMOS.find((d) => d.slug === slug);
    if (!demo) return <Navigate to="/demos" replace />;
    const { Component } = demo;
    return (
        <Suspense fallback={<div className="min-h-dvh" />}>
            <Component />
        </Suspense>
    );
}
