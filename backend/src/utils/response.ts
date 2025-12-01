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

export const successResponse = <T>(
  data: T,
  metadata?: Record<string, unknown>
): ApiSuccessEnvelope<T> => (
  metadata && Object.keys(metadata).length > 0
    ? { success: true, data, metadata }
    : { success: true, data }
);

export const errorResponse = (
  message: string,
  options: { code?: string; details?: unknown } = {}
): ApiErrorEnvelope => ({
  success: false,
  error: {
    message,
    ...(options.code ? { code: options.code } : {}),
    ...(options.details ? { details: options.details } : {})
  }
});
