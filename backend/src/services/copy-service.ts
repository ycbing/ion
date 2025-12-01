import type { AiProviderRouter } from "../providers/ai-provider-router";
import type { ProviderRegistry } from "../providers/provider-registry";
import type { GenerateCopyInput } from "../schemas/copy-schema";

export interface GenerateCopyResponse {
  provider: string;
  copies: {
    id: string;
    text: string;
    metadata?: Record<string, unknown>;
  }[];
  metadata: {
    topic: string;
    requestedVariants: number;
    deliveredVariants: number;
  };
}

export class CopyService {
  constructor(
    private readonly router: AiProviderRouter,
    private readonly registry: ProviderRegistry
  ) {}

  async generateCopy(payload: GenerateCopyInput): Promise<GenerateCopyResponse> {
    const provider = this.registry.resolveTextProviderName(payload.provider);
    const requestedVariants = payload.options?.variants ?? 1;

    const result = await this.router.generateCopy({
      provider,
      topic: payload.topic,
      prompt: payload.prompt,
      options: payload.options
    });

    return {
      provider: result.provider,
      copies: result.variants,
      metadata: {
        topic: payload.topic,
        requestedVariants,
        deliveredVariants: result.variants.length
      }
    };
  }
}
