import type { ProviderSettings } from "../config";
import { HttpError } from "../errors/http-error";

export class ProviderSelector {
  constructor(private readonly settings: ProviderSettings) {}

  resolve(requested?: string): string {
    const candidate = (requested ?? this.settings.default).trim().toLowerCase();

    if (!this.settings.enabled.includes(candidate)) {
      throw new HttpError(400, `Provider "${requested ?? candidate}" is not available`, {
        code: "PROVIDER_NOT_AVAILABLE"
      });
    }

    return candidate;
  }

  all(): string[] {
    return [...this.settings.enabled];
  }

  default(): string {
    return this.settings.default;
  }
}
