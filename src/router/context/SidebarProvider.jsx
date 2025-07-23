import React, { useState } from 'react';
import SidebarContext from './SidebarContext.jsx';

// ✅ Import components
import Introduction from '../GetingStarted/Introduction.jsx';
import ReactSetup from '../GetingStarted/Installation/ReactViteSetup.jsx';
import Tailwind from '../GetingStarted/Installation/TailwindSetup.jsx';
import ApexUICLI from '../GetingStarted/Installation/ApexUICLISetup.jsx';
import GlassNavbarEffect from '../../components/MainUI/ApexUI/GlassNavbar/GlassNavbarEffect.jsx';
import ScrollMarquee from '../../components/MainUI/ApexUI/ScrollMarquee/ScrollMarqueeEffect.jsx';
import EdgeglowFromEffect from '../../components/MainUI/ApexUI/EdgeGlowForm/EdgeglowFromEffect.jsx';
import GlassFormEffect from '../../components/MainUI/ApexUI/GlassCardStack/GlassCardStackEffect.jsx';
import GlassProfileEffect from '../../components/MainUI/ApexUI/GlassProfile/GlassProfileEffect.jsx';
import GlareCardEffect from '../../components/MainUI/ApexUI/GlareCard/GlareCardEffect.jsx';
import HoverTextEffect from '../../components/MainUI/ApexUI/HoverText/HoverTextEffect.jsx';
import SmartGridEffect from '../../components/MainUI/ApexUI/SmartGridCard/SmartGridEffect.jsx';
import HyperCardEffect from '../../components/MainUI/ApexUI/HyperCard/HyperCardEffect.jsx';
import RainBackgroundEffect from '../../components/MainUI/ApexUI/RainBackground/RainBackgroundEffect';
import ToolTipEffect from '../../components/MainUI/ApexUI/ToolTip/ToolTipEffect.jsx';
import WaterDropRevealEffect from '../../components/MainUI/ApexUI/WaterDropReavel/WaterDropReavelEffect.jsx';
import PointerFollowerEffect from '../../components/MainUI/ApexUI/PointerFollower/PointerFollowerEffect.jsx';
import BeamBarEffect from '../../components/MainUI/ApexUI/BeamBar.jsx/BeamBarEffect.jsx';
import LensFlareBackgroundEffect from '../../components/MainUI/ApexUI/LensFlareBackground/LensFlareBackgroundEffect.jsx';


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
                { name: 'Glass Card Stack', path: '/components/glass-card-stack', component: GlassFormEffect },
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
