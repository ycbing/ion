const FALLBACK_API_BASE_URL = "http://localhost:4000";

const sanitizeUrl = (value: string) => value.replace(/\/+$/, "");

const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? FALLBACK_API_BASE_URL).trim();

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    `[env] VITE_API_BASE_URL is not defined. Falling back to ${FALLBACK_API_BASE_URL}.`,
  );
}

export const env = Object.freeze({
  apiBaseUrl: sanitizeUrl(rawApiBaseUrl),
});
