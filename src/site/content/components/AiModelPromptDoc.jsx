import { useState } from 'react';
import ComponentDoc from '../../docs/ComponentDoc.jsx';
import ColorControl, { ControlGrid } from '../../docs/controls.jsx';
import { AiModelPrompt, DEFAULT_LLM_MODELS } from '../../../components/MainUI/ApexUI-Kit/AiModelPrompt/index.js';
import useSiteTheme from '../../ui/useSiteTheme.js';

const props = [
    { prop: 'models', type: '{ value, label, provider, description, tags?, settings }[]', def: 'DEFAULT_LLM_MODELS', desc: 'Models grouped by provider. settings: { temperature?, maxTokens?, reasoning?: string[] } decides which controls show.' },
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
    const [modelValue, setModelValue] = useState('claude-fable-5');
    const [configurations, setConfigurations] = useState({});
    const [prompt, setPrompt] = useState('');

    return (
        <ComponentDoc
            title="AI Model Prompt"
            description="A prompt composer with a model picker grouped by provider and per-model settings — temperature, max tokens and reasoning effort — remembered for every model. Works controlled or on its own."
            preview={
                <div className="flex w-full flex-col items-center gap-3 pt-[23rem]">
                    <AiModelPrompt
                        configurations={configurations}
                        models={DEFAULT_LLM_MODELS}
                        onConfigurationChange={(_, __, next) => setConfigurations(next)}
                        onModelChange={(model) => setModelValue(model.value)}
                        onPromptChange={setPrompt}
                        onSubmit={(payload) => setLast(payload)}
                        prompt={prompt}
                        value={modelValue}
                        theme={theme}
                        accentColor={accent}
                    />
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
            code={`import { useState } from "react";
import {
  DEFAULT_LLM_MODELS,
  AiModelPrompt,
} from "./ApexUI-Kit/AiModelPrompt";

export function PromptComposer() {
  const [modelValue, setModelValue] = useState("claude-fable-5");
  const [configurations, setConfigurations] = useState({});
  const [prompt, setPrompt] = useState("");

  return (
    <AiModelPrompt
      configurations={configurations}
      models={DEFAULT_LLM_MODELS}
      onConfigurationChange={(_, __, nextConfigurations) => {
        setConfigurations(nextConfigurations);
      }}
      onModelChange={(model) => {
        setModelValue(model.value);
      }}
      onPromptChange={setPrompt}
      onSubmit={({ model, configuration, prompt }) => {
        submitPrompt({ model, configuration, prompt });
      }}
      prompt={prompt}
      value={modelValue}
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
