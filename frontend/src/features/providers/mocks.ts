import type { ProviderOverview } from "./types";

export const providerOverviewFallback: ProviderOverview = {
  text: {
    active: "mock",
    providers: [
      {
        name: "mock",
        driver: "mock",
        label: "Local Mock Text Provider",
        promptTemplates: {
          default: "Draft {{variants}} friendly marketing blurb(s) for {{topic}}.",
        },
        options: {
          maxTokens: 256,
        },
        metadata: {
          latency: "fast",
        },
        credentials: {},
        missingCredentials: [],
        isActive: true,
      },
      {
        name: "openai",
        driver: "openai",
        label: "OpenAI GPT-4.1 Mini",
        promptTemplates: {
          default:
            "Write a concise marketing message about {{topic}}. Highlight the key benefits and keep the tone {{tone}}.",
        },
        options: {
          model: "gpt-4.1-mini",
          maxTokens: 600,
        },
        metadata: {
          supportsLanguages: ["en", "zh"],
        },
        credentials: {
          apiKey: {
            envVar: "OPENAI_API_KEY",
            optional: false,
            present: false,
          },
        },
        missingCredentials: ["apiKey"],
        isActive: false,
      },
    ],
  },
  image: {
    active: "mock",
    providers: [
      {
        name: "mock",
        driver: "mock",
        label: "Local Mock Image Provider",
        promptTemplates: {
          default: "Generate a placeholder visual inspired by: {{copy}}",
        },
        options: {},
        metadata: {
          aspectRatios: ["1:1", "4:5", "16:9"],
        },
        credentials: {},
        missingCredentials: [],
        isActive: true,
      },
      {
        name: "stability",
        driver: "stability",
        label: "Stability AI (Stable Diffusion XL)",
        promptTemplates: {
          default: "Create an illustrative image for the copy: {{copy}}",
        },
        options: {
          engine: "stable-diffusion-xl-1024-v1-0",
        },
        metadata: {
          preferredStyle: "photoreal",
        },
        credentials: {
          apiKey: {
            envVar: "STABILITY_API_KEY",
            optional: false,
            present: false,
          },
        },
        missingCredentials: ["apiKey"],
        isActive: false,
      },
    ],
  },
};
