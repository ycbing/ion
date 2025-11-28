import type {
  AiProviderRouter,
  GeneratedImage
} from "../providers/ai-provider-router";
import type { GenerateImageInput } from "../schemas/image-schema";
import { ProviderSelector } from "./provider-selector";

export interface GenerateImageResponse {
  provider: string;
  image: GeneratedImage;
  metadata: {
    copyPreview: string;
    appliedStyle: Record<string, unknown>;
  };
}

export class ImageService {
  constructor(
    private readonly router: AiProviderRouter,
    private readonly providerSelector: ProviderSelector
  ) {}

  async generateImage(
    payload: GenerateImageInput
  ): Promise<GenerateImageResponse> {
    const provider = this.providerSelector.resolve(payload.provider);

    const result = await this.router.generateImage({
      provider,
      copy: payload.copy,
      style: payload.style
    });

    return {
      provider: result.provider,
      image: result.image,
      metadata: {
        copyPreview: payload.copy.slice(0, 64),
        appliedStyle: payload.style ?? {}
      }
    };
  }
}
