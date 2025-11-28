export interface ProviderConfig {
  /** Unique identifier used throughout the application */
  name: string;
  /** Human-readable label for UI consumption */
  label: string;
  /** Environment variable keys required for this provider */
  requiredEnv: string[];
  /** Default API base URL */
  baseUrl: string;
  /** Suggested model identifiers */
  models: string[];
}
