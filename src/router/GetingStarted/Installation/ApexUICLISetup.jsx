// ApexUICLISetup.jsx
import { CopyBlock, dracula } from 'react-code-blocks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownload,
    faTerminal,
    faPuzzlePiece,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const ApexUICLISetup = () => {
    return (
        <section className=" py-20 sm:px-8 lg:px-16 text-[wheat]">
            <div className="max-w-5xl mx-auto space-y-12">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FontAwesomeIcon icon={faDownload} className="text-purple-400" />
                    Install Apex UI via CLI
                </h2>

                {/* Step 1 */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                        Step 1: Run the CLI installer
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        This initializes Apex UI in your project, generating the <code>src/ApexUI</code> folder automatically.
                    </p>
                    <CopyBlock
                        text={`npm i apex-ui-kit`}
                        language="bash"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 2 */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faPuzzlePiece} className="text-purple-400" />
                        Step 2: Add a component like HyperCard
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        This command adds the animated <code>HyperCard</code> component to <code>src/ApexUI/</code>.
                    </p>
                    <CopyBlock
                        text={`npx i apex-ui-kit add hyper-card`}
                        language="bash"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 3 */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400" />
                        Step 3: Import and use in App.jsx
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Once added, you can instantly use your component like any other React import.
                    </p>
                    <CopyBlock
                        text={`import HyperCard from './ApexUI-Kit/HyperCard/HyperCard.jsx';

const App = () => {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <HyperCard />
    </main>
  );
};
export default App;`}
                        language="jsx"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>

                <p className="text-white/70 pt-6">
                    ✅ That’s it! Apex UI CLI makes it easy to scaffold and use beautiful, animated UI components instantly.
                </p>
            </div>
        </section>
    );
};

export default ApexUICLISetup;
