import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Usage: <NavbarScrollHide navbarRef={navbarRef} />
const NavbarScrollHide = ({ navbarRef }) => {
    useEffect(() => {
        if (!navbarRef?.current) return;
        gsap.registerPlugin(ScrollTrigger);
        let lastScroll = 0;
        let ticking = false;
        const nav = navbarRef.current;
        let showTween = null;
        let hideTween = null;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (scrollY > lastScroll && scrollY > 50) {
                        // Scrolling down, hide navbar
                        if (!hideTween || !hideTween.isActive()) {
                            hideTween = gsap.to(nav, { y: '-120%', duration: 0.4, ease: 'power2.out' });
                        }
                    } else {
                        // Scrolling up, show navbar
                        if (!showTween || !showTween.isActive()) {
                            showTween = gsap.to(nav, { y: '0%', duration: 0.4, ease: 'power2.out' });
                        }
                    }
                    lastScroll = scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (hideTween) hideTween.kill();
            if (showTween) showTween.kill();
        };
    }, [navbarRef]);
    return null;
};

export default NavbarScrollHide;
