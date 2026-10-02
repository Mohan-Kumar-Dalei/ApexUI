import DocShell from '../../docs/DocShell.jsx';
import GuideSteps, { Callout } from '../../docs/GuideSteps.jsx';
import { stepsToc } from '../../docs/toc.js';

const steps = [
    {
        title: 'Install the package',
        description: 'Install apex-ui-kit in your project. It provides the CLI used to add components.',
        code: 'npm i apex-ui-kit',
        lang: 'bash',
    },
    {
        title: 'Add a component',
        description: 'Add any component by name. Its source is copied into src/ApexUI-Kit/ so you own and can edit it.',
        code: 'npx apex-ui-kit add hyper-card',
        lang: 'bash',
    },
    {
        title: 'Import and use it',
        description: 'Use the component like any other React import.',
        file: 'src/App.jsx',
        code: `import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

const App = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <HyperCard />
    </main>
  );
};

export default App;`,
        lang: 'jsx',
    },
];

export default function CLISetup() {
    return (
        <DocShell
            title="ApexUI CLI"
            description="Add components to your project with a single command — no copy-pasting files by hand."
            toc={stepsToc(steps)}
        >
            <GuideSteps steps={steps} />
            <Callout>
                Every component page lists its own <code className="rounded bg-[var(--panel-2)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--ink)]">npx apex-ui-kit add …</code> command under <strong className="text-[var(--ink)]">Installation</strong>.
            </Callout>
        </DocShell>
    );
}
