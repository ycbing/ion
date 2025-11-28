import { env } from "../../env";
import { ProviderConfig } from "../types";

export const anthropicConfig: ProviderConfig = {
  name: "anthropic",
  label: "Anthropic Claude",
  requiredEnv: ["ANTHROPIC_API_KEY"],
  baseUrl: env.anthropic.baseUrl,
  models: [env.anthropic.model],
};
