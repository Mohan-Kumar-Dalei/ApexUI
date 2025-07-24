import React, { useState, useEffect } from 'react';
import Home from './Home.jsx';
import FeaturesCard from './FeaturesCard';
import ComponentShowcase from './ComponentShowcase';
import ModernCharReveal from './ModernCharReveal';
import SpecialEffectsSection from './SpecialEffectsSection';
import SmoothScroll from '../components/utils/SmoothScroll.jsx';
import Footer from './Footer.jsx';
import Top from './Top.jsx';
import Loading from './Loading.jsx';
import Navbar from './Navbar.jsx';
const Hero = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="fixed inset-0 w-full h-full z-[1500]">
                <Loading />
            </div>
        );
    }
    return (
        <>
            <Navbar />
            <SmoothScroll>
                <div data-barba="container" data-barba-namespace="home" className="w-full min-h-screen relative bg-slate-900">
                    <div className="scroll-content min-h-screen">
                        <Home />
                        <FeaturesCard />
                        <ComponentShowcase />
                        <ModernCharReveal />
                        <SpecialEffectsSection />
                        <Footer />
                    </div>
                </div>
            </SmoothScroll>
            <Top />
        </>
    );
}

export default Hero
