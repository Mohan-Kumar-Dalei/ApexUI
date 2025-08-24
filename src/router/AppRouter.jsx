import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import Components from './GetingStarted/Components.jsx';
import TemplateSoon from "../components/TemplatesSoon.jsx"
export default function AppRouter() {
    const location = useLocation();
    const prevPathRef = React.useRef(location.pathname);
    useEffect(() => {
        if (location.pathname === "/" && prevPathRef.current !== "/") {
            window.location.reload();
        }
        prevPathRef.current = location.pathname;
    }, [location.pathname]);
    return (
        <Routes>
            <Route path="/" element={
                <>
                    <Hero />
                </>
            } />
            <Route path="/components" element={<Components />} />
            <Route path="/templates-soon" element={<TemplateSoon />} />
            <Route path="/components/:section" element={<Components />} />
            <Route path="/components/docs/getting-started/:section" element={<Components />} />
            <Route path="/components/docs/getting-started/installation/:section" element={<Components />} />
        </Routes>
    );
}

