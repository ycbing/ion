import type { Provider } from "./types";

export const providerFallback: Provider[] = [
  {
    name: "xiaohongshu-native",
    label: "Xiaohongshu Native",
    baseUrl: "https://api.xiaohongshu.com/creative",
    models: ["storycraft-pro", "trend-scout", "caption-charm"],
  },
  {
    name: "openai",
    label: "OpenAI Studio",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4.1", "gpt-3.5-turbo"],
  },
  {
    name: "anthropic",
    label: "Anthropic Bedrock",
    baseUrl: "https://anthropic.platform",
    models: ["claude-3-opus", "claude-3-haiku"],
  },
];
