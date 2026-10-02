import ComponentDoc from '../../docs/ComponentDoc.jsx';
import FlipProfile from '../../../components/MainUI/ApexUI-Kit/FlipProfile/FlipProfile.jsx';
import ParallaxProfile from '../../../components/MainUI/ApexUI-Kit/ParallaxProfile/ParallaxProfile.jsx';

const variants = [
    {
        name: 'Flip Profile',
        description: 'An animated profile card with a 3D flip, perfect for showcasing user details and social links.',
        preview: (
            <div className="flex w-full max-w-xs items-center justify-center">
                <FlipProfile />
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
            <div className="flex w-full max-w-xs items-center justify-center">
                <ParallaxProfile />
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

export default function ProfileDoc() {
    return (
        <ComponentDoc
            title="Profile"
            description="Animated profile cards for portfolios and team pages, in flip and parallax styles."
            variants={variants}
        />
    );
}
