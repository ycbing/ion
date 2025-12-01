import { HttpError } from "../../errors/http-error";
import {
  CopyGenerationRequest,
  CopyGenerationResult,
  CopyVariant,
  ProviderInitPayload,
  TextProvider
} from "../types";
import { renderTemplate } from "../utils";

interface OpenAiOptions {
  model?: string;
  maxTokens?: number;
}

const MAX_VARIANTS = 5;

export class OpenAiTextProvider implements TextProvider {
  public readonly name: string;

  public readonly label: string;

  public readonly driver: string;

  public readonly promptTemplates: Record<string, string>;

  public readonly options: Record<string, unknown>;

  public readonly metadata: Record<string, unknown>;

  public readonly credentials: Record<string, string | undefined>;

  private readonly config: ProviderInitPayload;

  constructor(config: ProviderInitPayload) {
    this.name = config.name;
    this.label = config.label;
    this.driver = config.driver;
    this.promptTemplates = config.promptTemplates;
    this.options = config.options;
    this.metadata = config.metadata;
    this.credentials = config.credentials;
    this.config = config;
  }

  async generate(payload: CopyGenerationRequest): Promise<CopyGenerationResult> {
    const apiKey = this.credentials.apiKey;

    if (!apiKey) {
      throw new HttpError(400, `OpenAI provider \"${this.name}\" is missing credentials`, {
        code: "PROVIDER_CREDENTIALS_MISSING"
      });
    }

    const variantsRequested = Math.max(1, Math.min(payload.options?.variants ?? 1, MAX_VARIANTS));

    const prompt = payload.prompt ?? this.buildPrompt(payload);

    const options = this.options as OpenAiOptions;
    const modelName = options.model ?? "gpt-4.1-mini";

    const variants: CopyVariant[] = Array.from({ length: variantsRequested }).map((_, index) => ({
      id: `${this.name}-copy-${index + 1}`,
      text: `${prompt}\n\n(Model: ${modelName}, variant ${index + 1})`,
      metadata: {
        model: modelName,
        maxTokens: options.maxTokens ?? 600,
        sequence: index + 1,
        tone: payload.options?.tone ?? "default"
      }
    }));

    return {
      provider: this.name,
      variants
    };
  }

  private buildPrompt(payload: CopyGenerationRequest): string {
    const template = this.promptTemplates.default ?? "Write a compelling message about {{topic}}.";

    return renderTemplate(template, {
      topic: payload.topic,
      tone: payload.options?.tone ?? "balanced",
      audience: payload.options?.audience ?? "general audience",
      language: payload.options?.language ?? "en",
      variants: payload.options?.variants ?? 1
    }).trim();
  }
}
