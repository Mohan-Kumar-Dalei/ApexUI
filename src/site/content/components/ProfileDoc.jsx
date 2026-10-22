import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid, RangeControl, SelectControl } from '../../docs/controls.jsx';
import { cdn } from '../../ui/cdn.js';
import FlipProfile from '../../../components/MainUI/ApexUI-Kit/FlipProfile/FlipProfile.jsx';
import ParallaxProfile from '../../../components/MainUI/ApexUI-Kit/ParallaxProfile/ParallaxProfile.jsx';
import ProfileCard from '../../../components/MainUI/ApexUI-Kit/ProfileCard/ProfileCard.jsx';

// Same data as ParallaxProfile's defaults, with the avatar served from the CDN.
const parallaxProfile = {
    avatarUrl: cdn('/assets/spiderman.png', { w: 480 }),
    name: 'Spider Man',
    username: 'spider_man',
    dob: '10-08-2001',
    title: 'PhotoGrapher',
    status: 'Available for Hire',
    socialLinks: {
        github: 'https://github.com/',
        linkedin: 'https://www.linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://www.instagram.com/',
    },
    onHireClick: () => alert('Hire Me button clicked!'),
    onCvClick: () => alert('CV button clicked!'),
};

const baseVariants = [
    {
        name: 'Flip Profile',
        description: 'An animated profile card with a 3D flip, perfect for showcasing user details and social links.',
        preview: (
            <div className="flex w-full max-w-sm items-center justify-center">
                <FlipProfile avatar={cdn('/assets/ironman.png', { w: 320 })} />
            </div>
        ),
        code: `import FlipProfile from './ApexUI-Kit/FlipProfile/FlipProfile.jsx';

const App = () => (
  <FlipProfile
    name="Iron Man"
    role="AI Engineer"
    dob="5th March, 1999"
    avatar="/assets/ironman.png"
    github="#"
    linkedin="#"
    twitter="#"
    resumeLink="/Iron-Man-Resume.pdf"
    hireLink="#"
    bgColor="#0F172B"
  />
);

export default App;`,
        cli: 'flip-profile',
        props: [
            { prop: 'name', type: 'string', def: '"Iron Man"', desc: 'Profile name.' },
            { prop: 'role', type: 'string', def: '"AI Engineer"', desc: 'Role or profession.' },
            { prop: 'dob', type: 'string', def: '"5th March, 1999"', desc: 'Date of birth.' },
            { prop: 'avatar', type: 'string', def: '"..."', desc: 'Profile image URL.' },
            { prop: 'github', type: 'string', def: '"#"', desc: 'GitHub profile link.' },
            { prop: 'linkedin', type: 'string', def: '"#"', desc: 'LinkedIn profile link.' },
            { prop: 'twitter', type: 'string', def: '"#"', desc: 'Twitter/X profile link.' },
            { prop: 'resumeLink', type: 'string', def: '"..."', desc: 'Resume PDF link.' },
            { prop: 'hireLink', type: 'string', def: '"#"', desc: 'Contact or hire link.' },
            { prop: 'bgColor', type: 'string', def: '"#2d133b"', desc: 'Card background color.' },
        ],
        dependencies: [
            { name: 'React', desc: 'Modern React library for UI building.' },
            { name: 'Framer Motion', desc: 'Animation library for smooth effects.' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
        ],
    },
    {
        name: 'Parallax Profile',
        description: 'A profile card with a parallax hover effect that adds depth and interactivity.',
        preview: (
            <div className="flex w-full max-w-sm items-center justify-center">
                <ParallaxProfile profile={parallaxProfile} />
            </div>
        ),
        code: `import ParallaxProfile from './ApexUI-Kit/ParallaxProfile/ParallaxProfile.jsx';

const profiles = [
  {
    name: "Spider Man",
    status: "Available for Hire",
    avatarUrl: "/assets/spiderman.png",
    username: "spider_man",
    title: "Photographer",
    bgColor: "#1a1a2e",
    socials: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
      twitter: "https://twitter.com/",
      instagram: "https://www.instagram.com/",
    },
  },
];

const App = () => <ParallaxProfile profiles={profiles} />;

export default App;`,
        cli: 'parallax-profile',
        props: [
            { prop: 'profiles', type: 'array', def: '[defaultProfile]', desc: 'Profiles to render. Each item has name, status, avatarUrl, username, title, bgColor and socials.' },
            { prop: 'className', type: 'string', def: "''", desc: 'Classes for the wrapper.' },
        ],
        dependencies: [
            { name: 'React', desc: 'Modern React library for UI building.' },
            { name: 'GSAP', desc: 'Animation library for smooth effects.' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid styling.' },
        ],
    },
];

const cardProps = [
    { prop: 'variant', type: "'card' | 'lanyard'", def: '"card"', desc: 'Profile card, or the same profile as an ID badge on a ribbon.' },
    { prop: 'profile', type: '{ name, role, company, location, bio, avatar, id, stats, socials }', def: 'demo profile', desc: 'Profile details; anything left out falls back to the demo.' },
    { prop: 'color', type: 'string', def: '"#a3e635"', desc: 'Accent color (cover glow, Follow button, ribbon, badge header).' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Card colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes for the wrapper.' },
];

const cardDependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Tilt, drag and pendulum springs.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

const themeOptions = [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }];

const cardSnippet = (extra) => `import ProfileCard from './ApexUI-Kit/ProfileCard/ProfileCard.jsx';

const profile = {
  name: "Mohan Dalei",
  role: "Frontend Engineer",
  company: "ApexUI",
  location: "Bhubaneswar, India",
  avatar: "/me.png",
  id: "APX-0042",
};

const App = () => <ProfileCard profile={profile}${extra} />;

export default App;`;

export default function ProfileDoc() {
    const [color, setColor] = useState('#a3e635');
    const [theme, setTheme] = useState('dark');
    const [strap, setStrap] = useState(10);

    const variants = [
        ...baseVariants,
        {
            name: 'Profile Card',
            description: 'Cover, avatar with online dot, bio, stats, socials and a Follow toggle, with a soft 3D tilt under the pointer.',
            preview: <ProfileCard variant="card" color={color} theme={theme} />,
            controls: (
                <ControlGrid>
                    <ColorControl label="Accent" value={color} onChange={setColor} />
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
                </ControlGrid>
            ),
            code: cardSnippet(` variant="card" color="${color}" theme="${theme}"`),
            cli: 'profile-card',
            props: cardProps,
            dependencies: cardDependencies,
        },
        {
            name: 'ID Lanyard',
            description: 'The same profile as an ID badge on a printed ribbon. It drops in, and when you drag it and let go it swings back like a pendulum.',
            preview: <ProfileCard key={`${strap}-${theme}`} variant="lanyard" color={color} theme={theme} strapLength={strap} />,
            previewClassName: '!items-start',
            controls: (
                <ControlGrid>
                    <ColorControl label="Ribbon" value={color} onChange={setColor} />
                    <SelectControl label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
                    <RangeControl label="Strap length" value={strap} onChange={setStrap} min={6} max={14} step={0.5} format={(v) => `${v}rem`} />
                </ControlGrid>
            ),
            code: cardSnippet(` variant="lanyard" color="${color}" theme="${theme}" strapLength={${strap}}`),
            cli: 'profile-card',
            props: [...cardProps, { prop: 'strapLength', type: 'number', def: '10', desc: 'Ribbon length in rem (lanyard).' }],
            dependencies: cardDependencies,
        },
    ];

    return (
        <ComponentDoc
            title="Profile"
            description="Animated profile cards for portfolios and team pages, flip, parallax, a tilting profile card, or an ID badge swinging on a ribbon."
            variants={variants}
        />
    );
}
