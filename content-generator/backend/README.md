# Content Generator Backend

This package exposes the API surface for the content generator prototype. The server is an Express + TypeScript application with strong typing and runtime validation based on Zod. Configuration is sourced from `config/*.json` files with `dotenv` overrides, so environment variables declared in `.env` will take precedence over defaults.

## Running the server

```bash
npm run dev --workspace content-generator/backend
```

The server listens on `settings.server.port` (default `4000`) and exposes a simple health probe at `GET /health`.

## API overview

### `POST /api/copies`

Create marketing copy variants for a given topic and optional prompt/options payload. The active text provider is resolved by the provider registry; include the `provider` field to override it per request.

**Request body**

```json
{
  "topic": "Product launch announcement",
  "options": {
    "tone": "friendly",
    "audience": "existing customers",
    "keywords": ["eco-friendly", "recycled materials"],
    "language": "en",
    "variants": 2
  }
}
```

**Success response**

```json
{
  "success": true,
  "data": {
    "provider": "mock",
    "copies": [
      {
        "id": "mock-copy-1",
        "text": "..."
      }
    ],
    "metadata": {
      "topic": "Product launch announcement",
      "requestedVariants": 2,
      "deliveredVariants": 1
    }
  }
}
```

### `POST /api/images`

Produce an illustrative asset for a selected copy block plus optional style controls. As with text generation, the provider defaults to the active image vendor but can be overridden with a `provider` field.

**Request body**

```json
{
  "copy": "Say hello to our ecofriendly packaging",
  "style": {
    "mood": "uplifting",
    "palette": ["#0099cc", "#c0f5f7"],
    "aspectRatio": "16:9"
  }
}
```

**Success response**

```json
{
  "success": true,
  "data": {
    "provider": "mock",
    "image": {
      "url": "https://images.example.com/mock/mock.png",
      "altText": "AI generated visual for: Say hello to our ecofriendly packaging"
    },
    "metadata": {
      "copyPreview": "Say hello to our ecofriendly packaging",
      "appliedStyle": {
        "mood": "uplifting",
        "palette": ["#0099cc", "#c0f5f7"],
        "aspectRatio": "16:9"
      }
    }
  }
}
```

### `GET /api/providers`

Return the full provider registry, including the active provider for each domain, prompt templates, and credential status.

**Success response (abridged)**

```json
{
  "success": true,
  "data": {
    "text": {
      "active": "mock",
      "providers": [
        {
          "name": "openai",
          "label": "OpenAI GPT-4.1 Mini",
          "missingCredentials": ["apiKey"],
          "isActive": false
        },
        {
          "name": "mock",
          "label": "Local Mock Text Provider",
          "missingCredentials": [],
          "isActive": true
        }
      ]
    },
    "image": {
      "active": "mock",
      "providers": [
        {
          "name": "stability",
          "label": "Stability AI (Stable Diffusion XL)",
          "missingCredentials": ["apiKey"],
          "isActive": false
        }
      ]
    }
  }
}
```

### `PATCH /api/providers/active`

Switch the active provider for one or both domains without redeploying the backend. Credentials must be present for the requested provider or the request will fail with `PROVIDER_CREDENTIALS_MISSING`.

**Request body**

```json
{
  "text": "openai",
  "image": "stability"
}
```

**Success response**

```json
{
  "success": true,
  "data": {
    "text": {
      "active": "openai",
      "providers": [
        { "name": "openai", "isActive": true },
        { "name": "mock", "isActive": false }
      ]
    },
    "image": {
      "active": "stability",
      "providers": [
        { "name": "stability", "isActive": true },
        { "name": "mock", "isActive": false }
      ]
    }
  }
}
```

Every JSON payload is validated by Zod. Validation failures or provider resolution errors return a standard envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  }
}
```

## Provider configuration

The provider registry is defined in `config/providers.json`. It contains separate sections for text and image domains. Each provider entry includes:

- `driver`: the implementation to instantiate (built-in drivers: `openai`, `stability`, `mock`).
- `label`: the human-friendly name returned to clients.
- `promptTemplates`: optional tokenized templates used by the provider to build prompts (e.g. `{{topic}}`, `{{tone}}`).
- `credentials`: a map from credential aliases to environment variable names. The registry reads these values from `process.env` and tracks whether they are present.
- `options` / `metadata`: arbitrary configuration forwarded to the provider implementation.

To add or customise a provider:

1. Add (or update) an entry under `text.providers` or `image.providers` in `config/providers.json` with a unique name and driver.
2. Declare any required credentials by referencing environment variables (e.g. `"apiKey": "MY_PROVIDER_API_KEY"`).
3. If the driver is new, implement a class under `src/providers/vendors` that conforms to the `TextProvider` or `ImageProvider` interface and register it in `TEXT_PROVIDER_FACTORIES` or `IMAGE_PROVIDER_FACTORIES` inside `src/providers/provider-registry.ts`.
4. Restart the server so the registry reloads the configuration.

Sample environment variables are documented in `.env.example`. The built-in providers expect:

- `OPENAI_API_KEY` for the OpenAI text driver.
- `STABILITY_API_KEY` for the Stability image driver.

## Testing

Run the backend unit tests with:

```bash
npm run test --workspace content-generator/backend
```
