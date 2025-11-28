import { env } from "../env";
import { anthropicConfig } from "./configs/anthropic";
import { openAiConfig } from "./configs/openai";
import { ProviderConfig } from "./types";

const allProviders: ProviderConfig[] = [openAiConfig, anthropicConfig];

const enabledProviders = allProviders.filter((provider) =>
  env.providerNames.includes(provider.name)
);

export const providerRegistry = {
  all(): ProviderConfig[] {
    return enabledProviders;
  },
  find(name: string): ProviderConfig | undefined {
    return enabledProviders.find((provider) => provider.name === name);
  },
};
