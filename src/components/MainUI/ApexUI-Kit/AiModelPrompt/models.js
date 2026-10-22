/*
 * Ready-made model list for AiModelPrompt. Each model says which settings it
 * supports; the settings panel only shows those. Swap in your own list or
 * extend this one.
 */
export const DEFAULT_LLM_MODELS = [
    { value: "claude-fable-5", label: "Claude Fable 5", provider: "Anthropic", description: "Most capable for deep, multi-step work.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "claude-opus-5-5", label: "Claude Opus 5.5", provider: "Anthropic", description: "Frontier quality for hard problems.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", provider: "Anthropic", description: "Great balance for writing and code.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "claude-haiku-5-5", label: "Claude Haiku 5.5", provider: "Anthropic", description: "Fast and light for everyday tasks.", tags: ["fast"], settings: { temperature: true, maxTokens: true } },
    { value: "gpt-5", label: "GPT-5", provider: "OpenAI", description: "General purpose flagship.", tags: ["reasoning", "vision"], settings: { maxTokens: true, reasoning: ["minimal", "low", "medium", "high"] } },
    { value: "gpt-5-mini", label: "GPT-5 mini", provider: "OpenAI", description: "Small, quick and capable.", tags: ["fast"], settings: { maxTokens: true, reasoning: ["low", "medium", "high"] } },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", description: "Long context and multimodal.", tags: ["reasoning", "vision"], settings: { temperature: true, maxTokens: true } },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", description: "Low latency at scale.", tags: ["fast", "vision"], settings: { temperature: true, maxTokens: true } },
];
