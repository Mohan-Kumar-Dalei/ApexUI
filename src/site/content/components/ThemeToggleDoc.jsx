import ComponentDoc, { DocSection } from '../../docs/ComponentDoc.jsx';
import CodeBlock from '../../ui/CodeBlock.jsx';
import ThemeToggle from '../../../components/MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';

const toggles = [
    { animation: 'circle' },
    { animation: 'circle-right' },
    { animation: 'circle-left' },
    { animation: 'split-reveal-horizontal' },
    { animation: 'chevron-wipe-right' },
    { animation: 'blur-fade' },
    { animation: 'gif', link: '/assets/ApexUI.gif' },
    { animation: 'gif', link: 'https://media.tenor.com/azoiEHypBKYAAAAi/ketawa-love.gif' },
    { animation: 'gif', link: 'https://media.tenor.com/6fO1ClbWx6YAAAAi/raamking.gif' },
];

const code = `import ThemeToggle from './ApexUI-Kit/ThemeToggle/ThemeToggle.jsx';

const App = () => (
  <>
    {/* Built-in animation */}
    <ThemeToggle LightTheme="light" animation="circle-left" duration="1s" />

    {/* GIF animation */}
    <ThemeToggle
      LightTheme="light"
      animation={{ type: 'gif', link: '/assets/ApexUI.gif' }}
    />
  </>
);

export default App;`;

const themeSetup = `/* 1. Define your theme in CSS */
.theme-light {
  --color-bg: #ffffff;   /* replace only the color values */
  --color-text: #18181b;
}

/* 2. Register it in ThemeConfig.js */
export const THEMES = {
  light: "theme-light",
};

/* 3. Use it */
<ThemeToggle LightTheme="light" />`;

const animationSetup = `// 1. Add a case in ThemeAnimation.js
case "circle-left": {
  return header + \`
    ::view-transition-new(root) {
      mask: url('data:image/svg+xml,<svg…/>') top left / 0 no-repeat;
      transform-origin: top left;
      animation: vt-scale-tl var(--vt-duration);
    }
    @keyframes vt-scale-tl {
      to { mask-size: 350vmax; }
    }
  \`;
}

// 2. Use a built-in animation
<ThemeToggle animation="circle-left" />

// …or any transparent GIF (right-click → Copy image address)
<ThemeToggle animation={{ type: "gif", link: "your-gif-link.gif" }} />`;

const props = [
    { prop: 'LightTheme', type: 'string', def: "'light'", desc: 'Name of the light theme registered in ThemeConfig.js.' },
    { prop: 'animation', type: 'string | { type, link }', def: "'circle'", desc: 'Built-in animation name, or { type: "gif", link } for a GIF reveal.' },
    { prop: 'duration', type: 'string', def: "'1.5s'", desc: 'Duration of the reveal animation.' },
    { prop: 'ease', type: 'string', def: "'var(--vt-ease)'", desc: 'Easing of the reveal animation.' },
    { prop: 'className', type: 'string', def: "''", desc: 'Classes for the toggle button.' },
    { prop: 'onApplied', type: '(theme) => void', def: '—', desc: 'Called after a theme has been applied.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework for rapid styling.' },
];

export default function ThemeToggleDoc() {
    return (
        <ComponentDoc
            title="Theme Toggle"
            description="A light/dark switch with view-transition reveal animations — including custom GIF reveals. Try them: each one switches this site's theme."
            preview={
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {toggles.map((t, i) => (
                        <div key={i} className="group relative">
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--ink-2)] transition hover:border-[var(--lime-line)] hover:text-[var(--ink)] [&_button]:inline-flex [&_button]:items-center [&_button]:justify-center [&_svg]:h-5 [&_svg]:w-5">
                                <ThemeToggle LightTheme="light" animation={{ type: t.animation, link: t.link }} duration="1.2s" ease="var(--vt-ease)" className="text-[var(--ink-2)]" />
                            </span>
                            <span className="pointer-events-none absolute -bottom-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100">
                                {t.animation}
                            </span>
                        </div>
                    ))}
                </div>
            }
            code={code}
            cli="theme-toggle"
            props={props}
            dependencies={dependencies}
            extra={
                <DocSection id="setup" title="Setup" description="Add your own themes and reveal animations.">
                    <div className="space-y-4">
                        <CodeBlock title="Themes" code={themeSetup} language="css" />
                        <CodeBlock title="Animations" code={animationSetup} language="javascript" />
                    </div>
                </DocSection>
            }
        />
    );
}
