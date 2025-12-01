import {
  CopyGenerationRequest,
  CopyGenerationResult,
  CopyVariant,
  ProviderInitPayload,
  TextProvider
} from "../types";
import { renderTemplate } from "../utils";

const MAX_VARIANTS = 5;

export class MockTextProvider implements TextProvider {
  public readonly name: string;

  public readonly label: string;

  public readonly driver: string;

  public readonly promptTemplates: Record<string, string>;

  public readonly options: Record<string, unknown>;

  public readonly metadata: Record<string, unknown>;

  public readonly credentials: Record<string, string | undefined>;

  constructor(private readonly config: ProviderInitPayload) {
    this.name = config.name;
    this.label = config.label;
    this.driver = config.driver;
    this.promptTemplates = config.promptTemplates;
    this.options = config.options;
    this.metadata = config.metadata;
    this.credentials = config.credentials;
  }

  async generate(payload: CopyGenerationRequest): Promise<CopyGenerationResult> {
    const variantsRequested = Math.max(1, Math.min(payload.options?.variants ?? 1, MAX_VARIANTS));

    const prompt = payload.prompt ?? this.buildPrompt(payload, variantsRequested);

    const variants: CopyVariant[] = Array.from({ length: variantsRequested }).map((_, index) => ({
      id: `${this.name}-copy-${index + 1}`,
      text: `${prompt}\n\n(Mock provider variant ${index + 1})`,
      metadata: {
        tone: payload.options?.tone ?? "neutral",
        language: payload.options?.language ?? "en",
        generatedBy: "mock"
      }
    }));

    return {
      provider: this.name,
      variants
    };
  }

  private buildPrompt(payload: CopyGenerationRequest, variants: number): string {
    const template = this.promptTemplates.default ?? "Generate {{variants}} creative ideas about {{topic}}.";

    return renderTemplate(template, {
      topic: payload.topic,
      tone: payload.options?.tone ?? "neutral",
      audience: payload.options?.audience ?? "general audience",
      variants
    }).trim();
  }
}
