import React, { useState } from 'react';
import SidebarContext from './SidebarContext.jsx';

// ✅ Import components
import Introduction from '../GetingStarted/Introduction.jsx';
import ReactSetup from '../GetingStarted/Installation/ReactViteSetup.jsx';
import Tailwind from '../GetingStarted/Installation/TailwindSetup.jsx';
import ApexUICLI from '../GetingStarted/Installation/ApexUICLISetup.jsx';
import GlassNavbarEffect from '../../components/MainUI/Pages/GlassNavbarEffect.jsx';
import ScrollMarquee from '../../components/MainUI/Pages/ScrollMarqueeEffect.jsx';
import EdgeglowFromEffect from '../../components/MainUI/Pages/EdgeglowFromEffect.jsx';
import GlassCardStack from '../../components/MainUI/Pages/GlassCardStackEffect';
import GlassProfileEffect from '../../components/MainUI/Pages/GlassProfileEffect.jsx';
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
                { name: 'GlassNavbar', path: '/components/glass-navbar', component: GlassNavbarEffect },
                { name: 'EdgeGlowForm', path: '/components/edge-glow-form', component: EdgeglowFromEffect },
                { name: 'Glass Card Stack', path: '/components/glass-card-stack', component: GlassCardStack },
                { name: 'GlassProfile', path: '/components/glass-profile', component: GlassProfileEffect },
                { name: 'Glare Card', path: '/components/glare-card', component: GlareCardEffect },
                { name: 'Tool Tip', path: '/components/tool-tip', component: ToolTipEffect },
                { name: 'Rain Background', path: '/components/rain-background', component: RainBackgroundEffect },
                { name: 'Lens Flare Background', path: '/components/lens-flare-background', component: LensFlareBackgroundEffect },
                { name: 'Scroll Marquee', path: '/components/scroll-marquee', component: ScrollMarquee },
                { name: 'Hover Text', path: '/components/hover-text', component: HoverTextEffect },
                { name: 'Smart Grid Card', path: '/components/smart-grid-card', component: SmartGridEffect },
                { name: 'Hyper Card', path: '/components/hyper-card', component: HyperCardEffect },
                { name: 'Water Drop Reveal', path: '/components/water-drop-reveal', component: WaterDropRevealEffect },
                { name: 'Pointer Follower', path: '/components/pointer-follower', component: PointerFollowerEffect },
                { name: 'Beam Bar', path: '/components/beam-bar', component: BeamBarEffect },
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
