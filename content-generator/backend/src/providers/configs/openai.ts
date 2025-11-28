import { settings } from "../../config";
import { ProviderConfig } from "../types";

export const openAiConfig: ProviderConfig = {
  name: "openai",
  label: "OpenAI",
  requiredEnv: ["OPENAI_API_KEY"],
  baseUrl: settings.ai.openai.baseUrl,
  models: [settings.ai.openai.model]
};
