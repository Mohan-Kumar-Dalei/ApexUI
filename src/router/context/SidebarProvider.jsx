import React, { useState } from 'react';
import SidebarContext from './SidebarContext.jsx';

// ✅ Import components
import Introduction from '../GetingStarted/Introduction.jsx';
import ReactSetup from '../GetingStarted/Installation/ReactViteSetup.jsx';
import Tailwind from '../GetingStarted/Installation/TailwindSetup.jsx';
import ApexUICLI from '../GetingStarted/Installation/ApexUICLISetup.jsx';
import NavMenuEffect from '../../components/MainUI/Pages/NavMenuEffect.jsx';
import ScrollMarquee from '../../components/MainUI/Pages/ScrollMarqueeEffect.jsx';
import EdgeglowFromEffect from '../../components/MainUI/Pages/EdgeglowFromEffect.jsx';
import GlassCardStack from '../../components/MainUI/Pages/GlassCardStackEffect';
import ProfileEffect from '../../components/MainUI/Pages/ProfileEffect.jsx';
import GlareCardEffect from '../../components/MainUI/Pages/GlareCardeffect.jsx';
import HoverTextEffect from '../../components/MainUI/Pages/HoverTextEffect.jsx';
import SmartGridEffect from '../../components/MainUI/Pages/SmartGridEffect.jsx';
import HyperCardEffect from '../../components/MainUI/Pages/HyperCardEffect.jsx';
import RainBackgroundEffect from '../../components/MainUI/Pages/RainBackgroundEffect.jsx';
import ToolTipEffect from '../../components/MainUI/Pages/ToolTipEffect.jsx';
import WaterDropRevealEffect from '../../components/MainUI/Pages/WaterDropRevealEffect.jsx';
import PointerFollowerEffect from '../../components/MainUI/Pages/PointerFollowerEffect.jsx';
import BeamBarEffect from '../../components/MainUI/Pages/BeamBarEffect.jsx';
import LensFlareBackgroundEffect from '../../components/MainUI/Pages/LensFlareBackgroundEffect.jsx';
import ThemeToggleEffect from '../../components/MainUI/Pages/ThemeToggleEffect.jsx';
import NavDropDownEffect from '../../components/MainUI/Pages/NavDropDownEffect.jsx';
import TestimonialsEffect from '../../components/MainUI/Pages/TestimonialsEffect.jsx';
import ParallaxCardEffect from '../../components/MainUI/Pages/ParallaxCardEffect.jsx'
import AvatarEffect from '../../components/MainUI/Pages/AvatarEffect.jsx'
import CarouselEffect from '../../components/MainUI/Pages/CarouselEffect.jsx'
import FloatingOrbs from '../../components/MainUI/Pages/FloatingOrbsEffect.jsx';
import RippleBackgroundEffect from '../../components/MainUI/Pages/RippleBackgroundEffect.jsx';
import kineticThreadBackgroundEffect from '../../components/MainUI/Pages/KineticThreadsBackgroundEffect.jsx';
import LuminousParticleOceanEffect from '../../components/MainUI/Pages/LuminousParticleOceanEffect.jsx';
import SmokeBackgroundEffect from '../../components/MainUI/Pages/SmokeBackgroundEffect.jsx';
import CardsEffect from '../../components/MainUI/Pages/CardsEffect.jsx';
import BluePrintBackground from '../../components/MainUI/Pages/BluePrintBackgroundEffect.jsx';
import AccordionMarqueeEffect from '../../components/MainUI/Pages/AccordionMarqueeEffect.jsx';


const SidebarProvider = (props) => {
    const [data, setData] = useState([
        {
            key: 'gettingstarted',
            title: 'Getting Started',
            collapsed: false,
            content: [
                { name: 'Introduction', path: '/components/docs/getting-started/introduction', component: Introduction },
            ],
        },
        {
            key: 'installation',
            title: 'Installation',
            collapsed: false,
            content: [
                { name: 'React + Vite Setup', path: '/components/docs/getting-started/installation/react-setup', component: ReactSetup },
                { name: 'Tailwind Setup', path: '/components/docs/getting-started/installation/tailwind-setup', component: Tailwind },
                { name: 'ApexUI CLI Setup', path: '/components/docs/getting-started/installation/apexui-cli', component: ApexUICLI },
            ],
        },
        {
            key: 'components',
            title: 'Components',
            collapsed: false,
            content: [

                { name: 'Avatar', path: '/components/avatar', component: AvatarEffect, },
                { name: 'Accordion Marquee', path: '/components/accordion-marquee', component: AccordionMarqueeEffect, badge: "New" },
                { name: 'Beam Bar', path: '/components/beam-bar', component: BeamBarEffect },
                { name: 'BluePrint Background', path: '/components/blueprint-background', component: BluePrintBackground, badge: "New" },
                { name: 'Carousel', path: '/components/carousel', component: CarouselEffect, },
                { name: "Cards", path: '/components/cards', component: CardsEffect, badge: "New" },
                { name: 'EdgeGlowForm', path: '/components/edge-glow-form', component: EdgeglowFromEffect },
                { name: 'Glass Card Stack', path: '/components/glass-card-stack', component: GlassCardStack },
                { name: 'Glare Card', path: '/components/glare-card', component: GlareCardEffect },
                { name: 'Hover Text', path: '/components/hover-text', component: HoverTextEffect },
                { name: 'Hyper Card', path: '/components/hyper-card', component: HyperCardEffect, },
                { name: 'Kinetic Threads Background', path: '/components/kinetic-threads-background', component: kineticThreadBackgroundEffect, },
                { name: 'Lens Flare Background', path: '/components/lens-flare-background', component: LensFlareBackgroundEffect },
                { name: 'Luminous Particle Ocean', path: '/components/luminous-particle-ocean', component: LuminousParticleOceanEffect,},
                { name: 'Nav Menu', path: '/components/nav-menu', component: NavMenuEffect, },
                { name: 'Nav DropDown', path: '/components/nav-drop-down', component: NavDropDownEffect, },
                { name: 'Orbs Background', path: '/components/orbs-background', component: FloatingOrbs, },
                { name: 'Pointer Follower', path: '/components/pointer-follower', component: PointerFollowerEffect },
                { name: 'Profile', path: '/components/profile', component: ProfileEffect, },
                { name: 'Parallax Card', path: '/components/parallax-card', component: ParallaxCardEffect, },
                { name: 'Rain Background', path: '/components/rain-background', component: RainBackgroundEffect },
                { name: 'Ripple Background', path: '/components/ripple-background', component: RippleBackgroundEffect, },
                { name: 'Scroll Marquee', path: '/components/scroll-marquee', component: ScrollMarquee },
                { name: 'Smart Grid Card', path: '/components/smart-grid-card', component: SmartGridEffect },
                { name: 'Smoke Background', path: '/components/smoke-background', component: SmokeBackgroundEffect, },
                { name: 'ToolTip', path: '/components/tool-tip', component: ToolTipEffect, },
                { name: 'Theme Toggle', path: '/components/theme-toggle', component: ThemeToggleEffect, },
                { name: 'Testimonials', path: '/components/testimonials', component: TestimonialsEffect, },
                { name: 'Water Drop Reveal', path: '/components/water-drop-reveal', component: WaterDropRevealEffect },
            ],
        },
    ]);

    return (
        <SidebarContext.Provider value={{ data, setData }}>
            {props.children}
        </SidebarContext.Provider>
    );
};

export default SidebarProvider;
