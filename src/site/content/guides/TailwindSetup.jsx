import DocShell from '../../docs/DocShell.jsx';
import GuideSteps, { Callout } from '../../docs/GuideSteps.jsx';
import { stepsToc } from '../../docs/toc.js';

const steps = [
    {
        title: 'Install Tailwind CSS',
        description: 'Install Tailwind CSS and its official Vite plugin.',
        code: 'npm install tailwindcss @tailwindcss/vite',
        lang: 'bash',
    },
    {
        title: 'Add the Vite plugin',
        description: 'Register the Tailwind plugin in your Vite configuration.',
        file: 'vite.config.js',
        code: `import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});`,
        lang: 'javascript',
    },
    {
        title: 'Import Tailwind in your CSS',
        description: 'Add the Tailwind import at the top of your main stylesheet.',
        file: 'src/index.css',
        code: '@import "tailwindcss";',
        lang: 'css',
    },
    {
        title: 'Start the build',
        description: 'Run the dev server and start using Tailwind utility classes in your project.',
        code: 'npm run dev',
        lang: 'bash',
    },
];

export default function TailwindSetup() {
    return (
        <DocShell
            title="Tailwind CSS Setup"
            description="Add Tailwind CSS v4 to your Vite project. Every ApexUI component is styled with Tailwind utilities."
            toc={stepsToc(steps)}
        >
            <GuideSteps steps={steps} />
            <Callout>All set! You can now use Tailwind’s utility classes — and add ApexUI components with the CLI.</Callout>
        </DocShell>
    );
}
