import { useMutation } from "@tanstack/react-query";

import { generateCopy, generateImage } from "./api";
import type {
  CopyGenerationResult,
  GenerateCopyPayload,
  GenerateImagePayload,
  GenerateImageResult,
} from "./types";

export const useGenerateCopy = () =>
  useMutation<CopyGenerationResult, Error, GenerateCopyPayload>({
    mutationFn: generateCopy,
  });

export const useGenerateImage = () =>
  useMutation<GenerateImageResult, Error, GenerateImagePayload>({
    mutationFn: generateImage,
  });
