import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { HttpError } from "../errors/http-error";
import {
  CredentialStatus,
  ImageProvider,
  ImageProviderFactory,
  ProviderConfigFile,
  ProviderDefinition,
  ProviderDomain,
  ProviderDomainSummary,
  ProviderOverview,
  ProviderSummary,
  TextProvider,
  TextProviderFactory
} from "./types";
import { MockImageProvider } from "./vendors/mock-image-provider";
import { MockTextProvider } from "./vendors/mock-text-provider";
import { OpenAiTextProvider } from "./vendors/openai-text-provider";
import { StabilityImageProvider } from "./vendors/stability-image-provider";
import type { ProviderInitPayload, ProviderCredentialsConfig } from "./types";

const CONFIG_PATH = resolvePath(
  fileURLToPath(new URL("../../config/providers.json", import.meta.url))
);

export interface ProviderRegistryOptions {
  configPath?: string;
}

interface LoadedProviderRecord<TProvider> {
  name: string;
  normalizedName: string;
  definition: ProviderDefinition;
  provider: TProvider;
  promptTemplates: Record<string, string>;
  options: Record<string, unknown>;
  metadata: Record<string, unknown>;
  credentials: Record<string, string | undefined>;
  credentialStatus: Record<string, CredentialStatus>;
  missingCredentials: string[];
}

const TEXT_PROVIDER_FACTORIES: Record<string, TextProviderFactory> = {
  openai: (payload) => new OpenAiTextProvider(payload),
  mock: (payload) => new MockTextProvider(payload)
};

const IMAGE_PROVIDER_FACTORIES: Record<string, ImageProviderFactory> = {
  stability: (payload) => new StabilityImageProvider(payload),
  mock: (payload) => new MockImageProvider(payload)
};

export class ProviderRegistry {
  private readonly configPath: string;

  private readonly config: ProviderConfigFile;

  private readonly textProviders: Map<string, LoadedProviderRecord<TextProvider>>;

  private readonly imageProviders: Map<string, LoadedProviderRecord<ImageProvider>>;

  constructor(options: ProviderRegistryOptions = {}) {
    this.configPath = options.configPath ?? CONFIG_PATH;
    this.config = this.loadConfig();
    this.ensureActiveProvider("text");
    this.ensureActiveProvider("image");
    this.textProviders = this.instantiateTextProviders();
    this.imageProviders = this.instantiateImageProviders();
  }

  listProviders(): ProviderOverview {
    return {
      text: this.describeDomain("text"),
      image: this.describeDomain("image")
    };
  }

  async setActiveProviders(
    updates: Partial<Record<ProviderDomain, string>>
  ): Promise<ProviderOverview> {
    if (updates.text) {
      const record = this.resolveProviderForUse("text", updates.text);
      this.config.text.active = record.name;
    }

    if (updates.image) {
      const record = this.resolveProviderForUse("image", updates.image);
      this.config.image.active = record.name;
    }

    await this.persistConfig();
    return this.listProviders();
  }

  resolveTextProviderName(requested?: string): string {
    return this.resolveProviderForUse("text", requested).name;
  }

  resolveImageProviderName(requested?: string): string {
    return this.resolveProviderForUse("image", requested).name;
  }

  getTextProvider(name: string): TextProvider {
    return this.getProviderRecord("text", name).provider;
  }

  getImageProvider(name: string): ImageProvider {
    return this.getProviderRecord("image", name).provider;
  }

  private loadConfig(): ProviderConfigFile {
    const contents = readFileSync(this.configPath, "utf-8");
    return JSON.parse(contents) as ProviderConfigFile;
  }

  private ensureActiveProvider(domain: ProviderDomain) {
    const domainConfig = this.config[domain];
    const availableEntries = Object.keys(domainConfig.providers);

    if (availableEntries.length === 0) {
      throw new Error(`No providers configured for domain \"${domain}\"`);
    }

    const normalizedActive = this.normalizeName(domainConfig.active);
    const canonicalMap = new Map(
      availableEntries.map((name) => [this.normalizeName(name), name])
    );

    const canonicalActive = canonicalMap.get(normalizedActive);
    if (!canonicalActive) {
      domainConfig.active = availableEntries[0];
    } else {
      domainConfig.active = canonicalActive;
    }
  }

  private instantiateTextProviders(): Map<string, LoadedProviderRecord<TextProvider>> {
    const map = new Map<string, LoadedProviderRecord<TextProvider>>();

    for (const [name, definition] of Object.entries(this.config.text.providers)) {
      const record = this.createLoadedProvider("text", name, definition);
      map.set(record.normalizedName, record as LoadedProviderRecord<TextProvider>);
    }

    return map;
  }

  private instantiateImageProviders(): Map<string, LoadedProviderRecord<ImageProvider>> {
    const map = new Map<string, LoadedProviderRecord<ImageProvider>>();

    for (const [name, definition] of Object.entries(this.config.image.providers)) {
      const record = this.createLoadedProvider("image", name, definition);
      map.set(record.normalizedName, record as LoadedProviderRecord<ImageProvider>);
    }

    return map;
  }

  private createLoadedProvider(
    domain: ProviderDomain,
    name: string,
    definition: ProviderDefinition
  ): LoadedProviderRecord<TextProvider | ImageProvider> {
    const normalizedName = this.normalizeName(name);
    const promptTemplates = { ...(definition.promptTemplates ?? {}) };
    const options = { ...(definition.options ?? {}) };
    const metadata = { ...(definition.metadata ?? {}) };

    const { credentials, credentialStatus, missingCredentials } = this.resolveCredentials(
      definition.credentials ?? {}
    );

    const initPayload: ProviderInitPayload = {
      name,
      driver: definition.driver,
      label: definition.label,
      promptTemplates,
      options,
      metadata,
      credentials
    };

    const factory = this.getFactory(domain, definition.driver);
    const provider = factory(initPayload);

    return {
      name,
      normalizedName,
      definition,
      provider,
      promptTemplates,
      options,
      metadata,
      credentials,
      credentialStatus,
      missingCredentials
    };
  }

  private getFactory(
    domain: ProviderDomain,
    driver: string
  ): TextProviderFactory | ImageProviderFactory {
    if (domain === "text") {
      const factory = TEXT_PROVIDER_FACTORIES[driver];
      if (!factory) {
        throw new Error(`Unknown text provider driver: ${driver}`);
      }
      return factory;
    }

    const factory = IMAGE_PROVIDER_FACTORIES[driver];
    if (!factory) {
      throw new Error(`Unknown image provider driver: ${driver}`);
    }

    return factory;
  }

  private resolveCredentials(credentials: ProviderCredentialsConfig): {
    credentials: Record<string, string | undefined>;
    credentialStatus: Record<string, CredentialStatus>;
    missingCredentials: string[];
  } {
    const resolved: Record<string, string | undefined> = {};
    const status: Record<string, CredentialStatus> = {};
    const missing: string[] = [];

    for (const [key, entry] of Object.entries(credentials)) {
      const descriptor = typeof entry === "string" ? { env: entry } : entry;
      const envVar = descriptor.env;
      const optional = descriptor.optional ?? false;
      const value = envVar ? process.env[envVar]?.trim() : undefined;
      const present = Boolean(value);

      if (!present && !optional) {
        missing.push(key);
      }

      resolved[key] = value;
      status[key] = {
        envVar,
        optional,
        present
      };
    }

    return { credentials: resolved, credentialStatus: status, missingCredentials: missing };
  }

  private describeDomain(domain: ProviderDomain): ProviderDomainSummary {
    const domainConfig = this.config[domain];
    const normalizedActive = this.normalizeName(domainConfig.active);
    const providerMap = this.getProviderMap(domain);

    const providers = Object.keys(domainConfig.providers).map((name) => {
      const normalizedName = this.normalizeName(name);
      const record = providerMap.get(normalizedName);

      if (!record) {
        throw new Error(`Provider \"${name}\" is not loaded for domain ${domain}`);
      }

      const summary: ProviderSummary = {
        name: record.name,
        driver: record.definition.driver,
        label: record.definition.label,
        promptTemplates: { ...record.promptTemplates },
        options: { ...record.options },
        metadata: { ...record.metadata },
        credentials: Object.fromEntries(
          Object.entries(record.credentialStatus).map(([key, status]) => [
            key,
            { ...status }
          ])
        ),
        missingCredentials: [...record.missingCredentials],
        isActive: normalizedName === normalizedActive
      };

      return summary;
    });

    return {
      active: domainConfig.active,
      providers
    };
  }

  private getProviderMap(
    domain: ProviderDomain
  ): Map<string, LoadedProviderRecord<TextProvider | ImageProvider>> {
    return (domain === "text" ? this.textProviders : this.imageProviders) as Map<
      string,
      LoadedProviderRecord<TextProvider | ImageProvider>
    >;
  }

  private resolveProviderForUse(
    domain: ProviderDomain,
    requested?: string
  ): LoadedProviderRecord<TextProvider | ImageProvider> {
    const domainConfig = this.config[domain];
    const target = requested ?? domainConfig.active;
    const normalizedName = this.normalizeName(target);
    const providerMap = this.getProviderMap(domain);
    const record = providerMap.get(normalizedName);

    if (!record) {
      throw new HttpError(400, `Provider \"${requested ?? target}\" is not available for ${domain}`, {
        code: "PROVIDER_NOT_AVAILABLE"
      });
    }

    if (record.missingCredentials.length > 0) {
      throw new HttpError(400, `Provider \"${record.name}\" is missing credentials`, {
        code: "PROVIDER_CREDENTIALS_MISSING",
        details: {
          missing: record.missingCredentials
        }
      });
    }

    return record;
  }

  private getProviderRecord(
    domain: ProviderDomain,
    name: string
  ): LoadedProviderRecord<TextProvider | ImageProvider> {
    const normalizedName = this.normalizeName(name);
    const providerMap = this.getProviderMap(domain);
    const record = providerMap.get(normalizedName);

    if (!record) {
      throw new HttpError(400, `Provider \"${name}\" is not configured for ${domain}`, {
        code: "PROVIDER_NOT_AVAILABLE"
      });
    }

    return record;
  }

  private normalizeName(value: string): string {
    return value.trim().toLowerCase();
  }

  private async persistConfig(): Promise<void> {
    const serialized = `${JSON.stringify(this.config, null, 2)}\n`;
    await writeFile(this.configPath, serialized, { encoding: "utf-8" });
  }
}
