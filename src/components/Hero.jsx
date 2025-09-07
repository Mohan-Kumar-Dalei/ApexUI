import React, { useState, useEffect } from 'react';
import Home from './Home.jsx';
import FeaturesCard from './FeaturesCard';
import ComponentShowcase from './ComponentShowcase';
import FocusRevealText from './FocusRevealText.jsx';
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
        const timer = setTimeout(() => setLoading(false), 5700);
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
                <div id='smooth-wrapper'>
                    <div id='smooth-content'>
                        <Home />
                        <FeaturesCard />
                        <ComponentShowcase />
                        <FocusRevealText />
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
