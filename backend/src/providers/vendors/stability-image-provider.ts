import { HttpError } from "../../errors/http-error";
import {
  GeneratedImage,
  ImageGenerationRequest,
  ImageGenerationResult,
  ProviderInitPayload,
  ImageProvider
} from "../types";
import { renderTemplate } from "../utils";

interface StabilityOptions {
  engine?: string;
}

export class StabilityImageProvider implements ImageProvider {
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
    const apiKey = this.credentials.apiKey;

    if (!apiKey) {
      throw new HttpError(400, `Stability provider \"${this.name}\" is missing credentials`, {
        code: "PROVIDER_CREDENTIALS_MISSING"
      });
    }

    const prompt = this.buildPrompt(payload);
    const options = this.options as StabilityOptions;
    const engine = options.engine ?? "stable-diffusion-xl";

    const image: GeneratedImage = {
      url: `https://images.example.com/stability/${encodeURIComponent(this.name)}.png`,
      altText: `Stable Diffusion prompt: ${prompt.slice(0, 80)}`
    };

    return {
      provider: this.name,
      image,
      metadata: {
        engine,
        prompt,
        style: payload.style ?? {}
      }
    };
  }

  private buildPrompt(payload: ImageGenerationRequest): string {
    const template = this.promptTemplates.default ?? "Create an illustration for: {{copy}}";

    return renderTemplate(template, {
      copy: payload.copy,
      mood: payload.style?.mood,
      medium: payload.style?.medium,
      palette: payload.style?.palette?.join(", "),
      aspectRatio: payload.style?.aspectRatio
    }).trim();
  }
}
