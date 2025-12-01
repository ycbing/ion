import type { ProviderRegistry } from "./provider-registry";
import {
  CopyGenerationRequest,
  CopyGenerationResult,
  ImageGenerationRequest,
  ImageGenerationResult
} from "./types";

export interface AiProviderRouter {
  generateCopy(payload: CopyGenerationRequest): Promise<CopyGenerationResult>;
  generateImage(payload: ImageGenerationRequest): Promise<ImageGenerationResult>;
}

class RegistryBackedAiProviderRouter implements AiProviderRouter {
  constructor(private readonly registry: ProviderRegistry) {}

  async generateCopy(payload: CopyGenerationRequest): Promise<CopyGenerationResult> {
    const provider = this.registry.getTextProvider(payload.provider);
    return provider.generate(payload);
  }

  async generateImage(payload: ImageGenerationRequest): Promise<ImageGenerationResult> {
    const provider = this.registry.getImageProvider(payload.provider);
    return provider.generate(payload);
  }
}

export const createAiProviderRouter = (registry: ProviderRegistry): AiProviderRouter =>
  new RegistryBackedAiProviderRouter(registry);

export type {
  CopyGenerationRequest,
  CopyGenerationResult,
  ImageGenerationRequest,
  ImageGenerationResult
} from "./types";
