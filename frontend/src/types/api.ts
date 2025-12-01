export type ApiSuccessEnvelope<T> = {
  success: true;
  data: T;
  metadata?: Record<string, unknown>;
};

export type ApiErrorDetails = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ApiErrorEnvelope = {
  success: false;
  error: ApiErrorDetails;
};

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;
