
import React from "react";
import BasicCard from '../../components/MainUI/ApexUI-Kit/Cards/BasicCard.jsx';
// Manual JSON array for cards
const cardsData = [
    { title: "Avatar", summary: "A clean and simple component to display user avatars, with support for stacked groups.", image: "/assets/componentsimage/Avatar.png", link: "/components/avatar" },
    { title: "Accordion Marquee", summary: "An interactive accordion with a smooth marquee effect on hover.", image: "/assets/componentsimage/accordion-marquee.png", link: "/components/accordion-marquee" },
    { title: "Beam Bar", summary: "An animated beam bar with a pulsing light—perfect for modern loading states and dashboards.", image: "/assets/componentsimage/BeamBar.png", link: "/components/beam-bar" },
    { title: "BluePrint Background", summary: "A dynamic, animated blueprint-style grid background with interactive hover effects.", image: "/assets/componentsimage/blueprint-background.png", link: "/components/blueprint-background" },
    { title: "Carousel", summary: "A smooth and customizable carousel component for showcasing images or content.", image: "/assets/componentsimage/Carousel.png", link: "/components/carousel" },
    { title: "Basic Card", summary: "A simple card component with a title, description, and image.", image: "/assets/componentsimage/BasicCard.png", link: "/components/basic-card" },
    { title: "Edge from Glow", summary: "A container that emits a beautiful, blurred gradient glow from its edges, perfect for highlighting content.", image: "/assets/componentsimage/EdgeGlow Form.png", link: "/components/edge-glow-form" },
    { title: "Glass Card Stack", summary: "An interactive stack of glassmorphism cards that cycle automatically, perfect for showcasing projects or testimonials.", image: "/assets/componentsimage/CardStack.png", link: "/components/glass-card-stack" },
    { title: "Glare Card", summary: "A stunning card component with a reflective glare effect that follows the user's cursor.", image: "/assets/componentsimage/GlareCard.png", link: "/components/glare-card" },
    { title: "Hover Text Effect", summary: "A collection of engaging and interactive text hover effects to bring your UI to life.", image: "/assets/componentsimage/Animated Text.png", link: "/components/hover-text" },
    { title: "Hyper Card", summary: "A futuristic card with an animated starfield background and a warp-speed effect on hover.", image: "/assets/componentsimage/HyperCard.png", link: "/components/hyper-card" },
    { title: "Threads Background", summary: "A dynamic, generative background component that creates a subtle, animated noise texture.", image: "/assets/componentsimage/Threads Background.png", link: "/components/kinetic-threads-background" },
    { title: "LensFlare Background", summary: "A beautiful, animated lens flare effect to add a cinematic touch to your backgrounds.", image: "/assets/componentsimage/LensFlare Background.png", link: "/components/lens-flare-background" },
    { title: "Particle Ocean", summary: "A mesmerizing ocean simulation with particles and waves, perfect for immersive backgrounds.", image: "/assets/componentsimage/Ocean Background.png", link: "/components/luminous-particle-ocean" },
    { title: "Meteor Card", summary: "A captivating card with a meteor shower background effect, adding dynamic visual interest.", image: "/assets/componentsimage/meteor-card.png", link: "/components/meteor-card" },
    { title: "Nav Menu", summary: "Effortlessly highlight your navigation with animated indicators. Perfect for dashboards, landing pages, and more.", image: "/assets/componentsimage/Nav Menu.png", link: "/components/nav-menu" },
    { title: "Nav DropDown", summary: "A clean and accessible dropdown menu for navigation bars, powered by smooth animations.", image: "/assets/componentsimage/DropMenu.png", link: "/components/nav-drop-down" },
    { title: "Floating Orbs", summary: "A mesmerizing background effect with floating orbs that react to user interactions.", image: "/assets/componentsimage/ObsBackground.png", link: "/components/orbs-background" },
    { title: "Pointer Follower", summary: "An engaging pointer that follows the cursor, revealing images and information in a creative way.", image: "/assets/componentsimage/pointerFollwer.png", link: "/components/pointer-follower" },
    { title: "Profile", summary: "An animated profile card with a 3D flip effect, perfect for showcasing user information and social links.", image: "/assets/componentsimage/profile.png", link: "/components/profile" },
    { title: "Parallax Card", summary: "A visually stunning card that creates a 3D parallax effect as the user scrolls.", image: "/assets/componentsimage/ParallaxCard.png", link: "/components/parallax-card" },
    { title: "Rain Background", summary: "A beautiful, animated rain effect for your backgrounds with collision detection.", image: "/assets/componentsimage/Rain background.png", link: "/components/rain-background" },
    { title: "Ripple Background", summary: "A dynamic, generative background component that creates a subtle, animated noise texture.", image: "/assets/componentsimage/Ripple Background.png", link: "/components/ripple-background" },
    { title: "Smoke Background", summary: "A mesmerizing smoke simulation with dynamic lighting.", image: "/assets/componentsimage/Smoke background.png", link: "/components/smoke-background" },
    { title: "Tooltip Effect", summary: "A captivating tooltip effect with smooth animations and dynamic positioning.", image: "/assets/componentsimage/ToolTip.png", link: "/components/tool-tip" },
    { title: "Theme Toggle", summary: "A toggle switch for light and dark themes with smooth transitions.", image: "/assets/componentsimage/Theme Toggle.png", link: "/components/theme-toggle" },
    { title: "Testimonials", summary: "A section to showcase user testimonials with smooth transitions.", image: "/assets/componentsimage/Testimonials.png", link: "/components/testimonials" },




    // Add more cards manually here
];

const AllComponents = () => {
    return (
        <div className="w-full h-full flex flex-wrap justify-center items-center gap-6 bg-[var(--color-bg)] mt-20">
            <BasicCard
                data={cardsData}
            />
        </div>
    );
};

export default AllComponents;
