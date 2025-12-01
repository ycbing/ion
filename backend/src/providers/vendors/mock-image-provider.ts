import {
  GeneratedImage,
  ImageGenerationRequest,
  ImageGenerationResult,
  ProviderInitPayload,
  ImageProvider
} from "../types";
import { renderTemplate } from "../utils";

export class MockImageProvider implements ImageProvider {
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

  async generate(payload: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const prompt = this.buildPrompt(payload);

    const image: GeneratedImage = {
      url: `https://images.example.com/mock/${encodeURIComponent(this.name)}.png`,
      altText: `Mock image inspired by: ${prompt.slice(0, 64)}`
    };

    return {
      provider: this.name,
      image,
      metadata: {
        style: payload.style ?? {},
        prompt
      }
    };
  }

  private buildPrompt(payload: ImageGenerationRequest): string {
    const template = this.promptTemplates.default ?? "Create a placeholder visual for: {{copy}}";

    return renderTemplate(template, {
      copy: payload.copy,
      mood: payload.style?.mood,
      medium: payload.style?.medium
    }).trim();
  }
}
