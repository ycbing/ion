import type { ProviderOverview, ProviderDomain } from "../providers/types";
import type { ProviderRegistry } from "../providers/provider-registry";
import type { UpdateActiveProvidersInput } from "../schemas/provider-schema";

export class ProviderService {
  constructor(private readonly registry: ProviderRegistry) {}

  listProviders(): ProviderOverview {
    return this.registry.listProviders();
  }

  async updateActiveProviders(
    payload: UpdateActiveProvidersInput
  ): Promise<ProviderOverview> {
    const updates: Partial<Record<ProviderDomain, string>> = {};

    if (payload.text) {
      updates.text = payload.text;
    }

    if (payload.image) {
      updates.image = payload.image;
    }

    return this.registry.setActiveProviders(updates);
  }
}
