export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
}

export interface ApiErrorDetails {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiErrorEnvelope {
  success: false;
  error: ApiErrorDetails;
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
