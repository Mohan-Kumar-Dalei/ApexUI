import React from 'react';
import Home from './Home.jsx';

import FeaturesCard from './FeaturesCard';
import ComponentShowcase from './ComponentShowcase';
import ModernCharReveal from './ModernCharReveal';
import SpecialEffectsSection from './SpecialEffectsSection';
import SmoothScroll from '../components/utils/SmoothScroll.jsx';
import Footer from './Footer.jsx';
import Top from './Top.jsx';
const Hero = () => {
    return (
        <>
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


    )
}

export default Hero
