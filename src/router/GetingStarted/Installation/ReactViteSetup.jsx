// ReactViteSetup.jsx
import { CopyBlock, dracula, CodeBlock, } from 'react-code-blocks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faFolderOpen, faCodeBranch, faPlay, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ReactViteSetup = () => {

    return (
        <section className=" py-20 sm:px-8 lg:px-16  text-[wheat] ">
            <div className="max-w-5xl mx-auto space-y-12">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FontAwesomeIcon icon={faTerminal} className="text-purple-400" /> React + Vite Setup
                </h2>

                <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faFolderOpen} className="text-purple-400" /> Step 1: Open Terminal in a New Folder and Run Vite Setup
                        </h4>
                        <p className="text-sm text-white/60 ml-1">This command initializes a new Vite-powered project.</p>
                        <CopyBlock
                            text={`npm create vite@latest`}
                            language="bash"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />
                    </div>
                    {/* Prompt 1 */}
                    <div className="space-y-2">
                        <h4 className="text-md font-semibold  flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400" /> Prompt: Enter Your Project Name
                        </h4>
                        <p className="text-sm text-white/60 ml-1">This sets the folder name and base project structure.</p>
                        <CodeBlock
                            text={`✔ Project name: my-react-app`}
                            language="text"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />
                    </div>
                    {/* Prompt 2 */}
                    <div className="space-y-2">
                        <h4 className="text-md font-semibold  flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400" /> Prompt: Select Framework (Choose React)
                        </h4>
                        <p className="text-sm text-white/60 ml-1">Choose React to scaffold a new React application using Vite.</p>
                        <CodeBlock
                            text={`✔ Select a framework: › 'React'`}
                            language="text"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />
                    </div>
                    {/* Prompt 3 */}
                    <div className="space-y-2">
                        <h4 className="text-md font-semibold  flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400" /> Prompt: Select Language (JavaScript or TypeScript)
                        </h4>
                        <p className="text-sm text-white/60 ml-1">Choose JavaScript or TypeScript depending on your project needs.</p>
                        <CodeBlock
                            text={`✔ Select a variant: › JavaScript / TypeScript`}
                            language="text"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />

                    </div>

                    {/* Step 2 */}
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold  flex items-center gap-2">
                            <FontAwesomeIcon icon={faCodeBranch} className="text-purple-400" /> Step 2: Navigate into the Project and Install Dependencies
                        </h4>
                        <p className="text-sm text-white/60 ml-1">This installs all required packages listed in <code>package.json</code>.</p>
                        <CopyBlock
                            text={`cd my-react-app
npm install`}
                            language="bash"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />

                    </div>

                    {/* Step 3 */}
                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                            <FontAwesomeIcon icon={faPlay} className="text-purple-400" /> Step 3: Start the Development Server
                        </h4>
                        <p className="text-sm text-white/60 ml-1">Launches the local dev server at <code>localhost:5173</code> with live reload support.</p>
                        <CopyBlock
                            text={`npm run dev`}
                            language="bash"
                            theme={dracula}
                            showLineNumbers={false}
                            codeBlock
                        />

                    </div>

                    <p className="text-white/70 pt-6">
                        🎉 That’s it! You’ve successfully created a React + Vite project. You're now ready to set up Tailwind CSS and integrate ApexUI components.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ReactViteSetup;
