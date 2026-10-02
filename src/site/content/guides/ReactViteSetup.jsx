import DocShell from '../../docs/DocShell.jsx';
import GuideSteps, { Callout } from '../../docs/GuideSteps.jsx';
import { stepsToc } from '../../docs/toc.js';

const steps = [
    {
        title: 'Create a Vite project',
        description: 'Initialize a new Vite-powered project. You will be prompted for a project name and framework.',
        code: 'npm create vite@latest',
        lang: 'bash',
    },
    {
        title: 'Follow the prompts',
        description: "Select React as the framework and your preferred variant (JavaScript or TypeScript).",
        code: `✔ Project name: … my-react-app
✔ Select a framework: › React
✔ Select a variant: › JavaScript`,
        lang: 'text',
    },
    {
        title: 'Install dependencies',
        description: 'Move into the new project folder and install the packages listed in package.json.',
        code: `cd my-react-app
npm install`,
        lang: 'bash',
    },
    {
        title: 'Start the dev server',
        description: 'Launch the local dev server with live reload, usually at localhost:5173.',
        code: 'npm run dev',
        lang: 'bash',
    },
];

export default function ReactViteSetup() {
    return (
        <DocShell
            title="React + Vite Setup"
            description="Set up a new React project with Vite, the fast, modern frontend tooling ApexUI is built and tested with."
            toc={stepsToc(steps)}
        >
            <GuideSteps steps={steps} />
            <Callout>
                That’s it — your React + Vite project is ready. Next, set up <strong className="text-[var(--ink)]">Tailwind CSS</strong> so ApexUI components can be styled.
            </Callout>
        </DocShell>
    );
}
