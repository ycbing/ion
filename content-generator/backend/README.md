# Content Generator Backend

This package exposes the API surface for the content generator prototype. The server is an Express + TypeScript application with strong typing and runtime validation based on Zod. Configuration is sourced from `config/*.json` files with `dotenv` overrides, so environment variables declared in `.env` will take precedence over defaults.

## Running the server

```bash
npm run dev --workspace content-generator/backend
```

The server listens on `settings.server.port` (default `4000`) and exposes a simple health probe at `GET /health`.

## API overview

### `POST /api/copies`

Create marketing copy variants for a given topic and optional prompt/options payload.

**Request body**

```json
{
  "topic": "Product launch announcement",
  "prompt": "Highlight the sustainability story",
  "provider": "openai",
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
    "provider": "openai",
    "copies": [
      {
        "id": "openai-copy-1",
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

Produce an illustrative asset for a selected copy block plus optional style controls.

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
    "provider": "openai",
    "image": {
      "url": "https://images.example.com/openai/placeholder.png",
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

## Testing

Run the backend unit tests with:

```bash
npm run test --workspace content-generator/backend
```
