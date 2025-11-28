import { env } from "../../env";
import { ProviderConfig } from "../types";

export const openAiConfig: ProviderConfig = {
  name: "openai",
  label: "OpenAI",
  requiredEnv: ["OPENAI_API_KEY"],
  baseUrl: env.openAi.baseUrl,
  models: [env.openAi.model],
};
