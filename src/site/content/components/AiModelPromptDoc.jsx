import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import AiModelPrompt from '../../../components/MainUI/ApexUI-Kit/AiModelPrompt/AiModelPrompt.jsx';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'models', type: '{ value, label, provider, description, tags?, settings }[]', def: '4 demo models', desc: 'Models grouped by provider. settings: { temperature?, maxTokens?, reasoning?: string[] } decides which controls show.' },
    { prop: 'value', type: 'string', def: '—', desc: 'Selected model value (controlled).' },
    { prop: 'onModelChange', type: '(model) => void', def: '—', desc: 'Called when a model is picked.' },
    { prop: 'configurations', type: 'Record<model, config>', def: '—', desc: 'Settings per model (controlled).' },
    { prop: 'onConfigurationChange', type: '(model, config, allConfigs) => void', def: '—', desc: 'Called when a setting changes.' },
    { prop: 'prompt', type: 'string', def: '—', desc: 'Prompt text (controlled).' },
    { prop: 'onPromptChange', type: '(text) => void', def: '—', desc: 'Called as the prompt changes.' },
    { prop: 'onSubmit', type: '({ model, configuration, prompt }) => void', def: '—', desc: 'Called on Enter or send.' },
    { prop: 'placeholder', type: 'string', def: '"Ask anything…"', desc: 'Textarea placeholder.' },
    { prop: 'accentColor', type: 'string', def: '"#a3e635"', desc: 'Send button and active controls.' },
    { prop: 'theme', type: "'dark' | 'light'", def: '"dark"', desc: 'Panel colors.' },
    { prop: 'className', type: 'string', def: '""', desc: 'Extra classes.' },
];

const dependencies = [
    { name: 'React', desc: 'A JavaScript library for building user interfaces.' },
    { name: 'Framer Motion', desc: 'Popovers and the effort switch.' },
    { name: 'Lucide React', desc: 'Icons.' },
    { name: 'Tailwind CSS', desc: 'A utility-first CSS framework.' },
];

export default function AiModelPromptDoc() {
    const theme = useSiteTheme();
    const [accent, setAccent] = useState('#a3e635');
    const [last, setLast] = useState(null);

    return (
        <ComponentDoc
            title="AI Model Prompt"
            description="A prompt composer with a model picker grouped by provider and per-model settings — temperature, max tokens and reasoning effort — remembered for every model. Works controlled or on its own."
            preview={
                <div className="flex w-full flex-col items-center gap-3 pt-40">
                    <AiModelPrompt theme={theme} accentColor={accent} onSubmit={(payload) => setLast(payload)} />
                    <p className="h-5 max-w-2xl truncate font-mono text-[0.72rem] text-[var(--ink-3)]">
                        {last ? `sent → ${last.model.label} · ${JSON.stringify(last.configuration)}` : 'Pick a model, open the sliders, type and press Enter'}
                    </p>
                </div>
            }
            previewClassName="!items-end pb-10"
            controls={
                <ControlGrid>
                    <ColorControl label="Accent" value={accent} onChange={setAccent} />
                </ControlGrid>
            }
            code={`import { useState } from 'react';
import AiModelPrompt from './ApexUI-Kit/AiModelPrompt/AiModelPrompt.jsx';

const models = [
  { value: "claude-sonnet", label: "Claude Sonnet", provider: "Anthropic", description: "Writing and code.",
    settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
  { value: "gpt-mini", label: "GPT Mini", provider: "OpenAI", description: "Small and quick.",
    settings: { temperature: true, maxTokens: true } },
];

export function PromptComposer() {
  const [model, setModel] = useState("claude-sonnet");
  const [configurations, setConfigurations] = useState({});
  const [prompt, setPrompt] = useState("");

  return (
    <AiModelPrompt
      models={models}
      value={model}
      onModelChange={(m) => setModel(m.value)}
      configurations={configurations}
      onConfigurationChange={(_, __, next) => setConfigurations(next)}
      prompt={prompt}
      onPromptChange={setPrompt}
      onSubmit={({ model, configuration, prompt }) => sendToYourApi({ model, configuration, prompt })}
      accentColor="${accent}"
      theme="${theme}"
    />
  );
}`}
            cli="ai-model-prompt"
            props={props}
            dependencies={dependencies}
        />
    );
}
