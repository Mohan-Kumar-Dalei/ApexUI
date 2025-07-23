// TailwindViteSetup.jsx (Plugin-based Tailwind CSS Setup)
import { CopyBlock, dracula } from "react-code-blocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTerminal,
    faCheckCircle,
    faFileCode,
    faPlay,
    faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

const TailwindViteSetup = () => {
    return (
        <section className="py-20 sm:px-8 lg:px-16 text-[wheat]">
            <div className="max-w-5xl mx-auto space-y-12">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FontAwesomeIcon icon={faTerminal} className="text-purple-400" />
                    Install Tailwind CSS with Vite (Plugin Method)
                </h2>

                {/* Step 1: Create Project */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faFolderOpen} className="text-purple-400" />
                        Step 1: Create Your Vite Project
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        This command initializes a new Vite project and navigates into the
                        folder.
                    </p>
                    <CopyBlock
                        text={`npm create vite@latest my-project\ncd my-project`}
                        language="bash"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />

                </div>

                {/* Step 2: Install Tailwind CSS */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400" />
                        Step 2: Install Tailwind + Vite Plugin
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Installs Tailwind and its official Vite plugin
                        automatically.
                    </p>
                    <CopyBlock
                        text={`npm install tailwindcss @tailwindcss/vite`}
                        language="bash"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 3: Configure Plugin */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileCode} className="text-purple-400" />
                        Step 3: Add Tailwind Plugin in vite.config.js
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Registers the Tailwind plugin inside your Vite config.
                    </p>
                    <CopyBlock
                        text={`import { defineConfig } from 'vite';\nimport tailwindcss from '@tailwindcss/vite';\n\nexport default defineConfig({\n  plugins: [\n    tailwindcss(),\n  ],\n});`}
                        language="javascript"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 4: Import Tailwind */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileCode} className="text-purple-400" />
                        Step 4: Import Tailwind in your index.css File
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Enables Tailwind's base styles, component layers, and utility
                        classes.
                    </p>
                    <CopyBlock
                        text={`@import "tailwindcss";`}
                        language="css"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 5: Start Dev Server */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlay} className="text-purple-400" />
                        Step 5: Start Development Server
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Runs your Vite dev server with hot reload enabled.
                    </p>
                    <CopyBlock
                        text={`npm run dev`}
                        language="bash"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>
                {/* Step 6: Use Tailwind */}
                <div className="space-y-2">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileCode} className="text-purple-400" />
                        Step 6: Use Tailwind Classes
                    </h4>
                    <p className="text-sm text-white/60 ml-1">
                        Now you can use Tailwind utility classes in your HTML or JSX.
                    </p>
                    <CopyBlock
                        text={`<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/src/style.css" rel="stylesheet">
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">
      Apex UI
    </h1>
  </body>
</html>`}
                        language="html"
                        theme={dracula}
                        showLineNumbers={false}
                        codeBlock
                    />
                </div>

                <p className="text-white/70 pt-6">
                    ✅ All set! Tailwind v4.1 is now integrated into your Vite setup using
                    the plugin approach — no postcss.config needed.
                </p>
            </div>
        </section>
    );
};

export default TailwindViteSetup;
