import { apiClient } from "@/lib/api-client";
import { ensureSuccess } from "@/lib/api-helpers";
import type { ApiEnvelope } from "@/types/api";
import type {
  CopyGenerationResult,
  GenerateCopyPayload,
  GenerateImagePayload,
  GenerateImageResult,
} from "./types";

export const generateCopy = async (
  payload: GenerateCopyPayload,
): Promise<CopyGenerationResult> => {
  const response = await apiClient.post<ApiEnvelope<CopyGenerationResult>>("/copies", payload);
  const envelope = ensureSuccess(response.data);
  return envelope.data;
};

export const generateImage = async (
  payload: GenerateImagePayload,
): Promise<GenerateImageResult> => {
  const response = await apiClient.post<ApiEnvelope<GenerateImageResult>>("/images", payload);
  const envelope = ensureSuccess(response.data);
  return envelope.data;
};
