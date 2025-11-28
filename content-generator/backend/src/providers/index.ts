import { settings } from "../config";
import { anthropicConfig } from "./configs/anthropic";
import { openAiConfig } from "./configs/openai";
import { ProviderConfig } from "./types";

const allProviders: ProviderConfig[] = [openAiConfig, anthropicConfig];

const enabledProviders = allProviders.filter((provider) =>
  settings.providers.enabled.includes(provider.name)
);

const defaultProvider = enabledProviders.find(
  (provider) => provider.name === settings.providers.default
);

export const providerRegistry = {
  all(): ProviderConfig[] {
    return enabledProviders;
  },
  find(name: string): ProviderConfig | undefined {
    const normalized = name.trim().toLowerCase();
    return enabledProviders.find((provider) => provider.name === normalized);
  },
  default(): ProviderConfig | undefined {
    return defaultProvider;
  }
};
