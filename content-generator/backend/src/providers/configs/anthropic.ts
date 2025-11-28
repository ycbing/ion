import { settings } from "../../config";
import { ProviderConfig } from "../types";

export const anthropicConfig: ProviderConfig = {
  name: "anthropic",
  label: "Anthropic Claude",
  requiredEnv: ["ANTHROPIC_API_KEY"],
  baseUrl: settings.ai.anthropic.baseUrl,
  models: [settings.ai.anthropic.model]
};
