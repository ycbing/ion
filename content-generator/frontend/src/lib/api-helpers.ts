import type { ApiEnvelope, ApiSuccessEnvelope } from "@/types/api";

export class ApiError extends Error {
  constructor(message: string, public readonly code?: string, public readonly details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const ensureSuccess = <T>(envelope: ApiEnvelope<T>): ApiSuccessEnvelope<T> => {
  if (envelope.success) {
    return envelope;
  }

  const { message, code, details } = envelope.error;
  throw new ApiError(message, code, details);
};
