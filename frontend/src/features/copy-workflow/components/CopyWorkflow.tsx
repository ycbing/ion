import {
  Button,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/icons";
import {
  providerOverviewFallback,
  useProviderOverview,
  useUpdateActiveProviders,
  type ProviderOverview,
  type UpdateActiveProvidersPayload,
} from "@/features/providers";
import { ApiError } from "@/lib/api-helpers";
import { CopySuggestionsList } from "./CopySuggestionsList";
import { GeneratedImagesGallery } from "./GeneratedImagesGallery";
import { ImageConfirmationStep } from "./ImageConfirmationStep";
import { ProviderSettingsDrawer } from "./ProviderSettingsDrawer";
import { TopicInput } from "./TopicInput";
import { useGenerateCopy, useGenerateImage } from "../hooks";
import type {
  CopyGenerationMetadata,
  CopySuggestion,
  GenerateCopyPayload,
  ImageStyleOptions,
  WorkflowImageRecord,
} from "../types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
};

const findProviderLabel = (overview: ProviderOverview, domain: "text" | "image", name?: string) => {
  const domainSummary = overview[domain];
  const target = name ?? domainSummary.active;
  return domainSummary.providers.find((provider) => provider.name === target)?.label ?? target;
};

export const CopyWorkflow = () => {
  const { t } = useTranslation(["features", "common"]);
  const toast = useToast();
  const settingsDisclosure = useDisclosure();
  const { data: providerOverviewData } = useProviderOverview();
  const providerOverview = providerOverviewData ?? providerOverviewFallback;
  const updateProvidersMutation = useUpdateActiveProviders();
  const copyMutation = useGenerateCopy();
  const imageMutation = useGenerateImage();

  const [copies, setCopies] = useState<CopySuggestion[]>([]);
  const [copyMetadata, setCopyMetadata] = useState<CopyGenerationMetadata | undefined>(undefined);
  const [copyProvider, setCopyProvider] = useState<string | undefined>(undefined);
  const [selectedCopyId, setSelectedCopyId] = useState<string | null>(null);
  const [images, setImages] = useState<WorkflowImageRecord[]>([]);
  const [hasRequestedCopy, setHasRequestedCopy] = useState(false);

  const lastCopyPayloadRef = useRef<GenerateCopyPayload | null>(null);

  const selectedCopy = useMemo(
    () => copies.find((copy) => copy.id === selectedCopyId) ?? null,
    [copies, selectedCopyId],
  );

  const fallbackErrorMessage = t("features:copyWorkflow.errors.generic");

  const handleGenerateCopy = (payload: GenerateCopyPayload) => {
    setHasRequestedCopy(true);
    setCopies([]);
    setSelectedCopyId(null);
    setCopyMetadata(undefined);
    setCopyProvider(undefined);

    lastCopyPayloadRef.current = payload;
    copyMutation.mutate(payload, {
      onSuccess: (result) => {
        setCopies(result.copies);
        setCopyMetadata(result.metadata);
        setCopyProvider(result.provider);
        setSelectedCopyId(result.copies[0]?.id ?? null);
        toast({
          title: t("features:copyWorkflow.toasts.copyReady.title"),
          description: t("features:copyWorkflow.toasts.copyReady.description", {
            count: result.metadata.deliveredVariants,
            provider: findProviderLabel(providerOverview, "text", result.provider),
          }),
          status: "success",
          duration: 3500,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: t("features:copyWorkflow.toasts.copyFailed.title"),
          description: getErrorMessage(error, fallbackErrorMessage),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      },
    });
  };

  const handleRetryCopy = () => {
    if (!lastCopyPayloadRef.current) {
      return;
    }

    handleGenerateCopy(lastCopyPayloadRef.current);
  };

  const handleCopyChange = (id: string, text: string) => {
    setCopies((previous) => previous.map((copy) => (copy.id === id ? { ...copy, text } : copy)));
  };

  const handleGenerateImage = (style: ImageStyleOptions) => {
    if (!selectedCopy) {
      return;
    }

    const payload = {
      copy: selectedCopy.text,
      ...(providerOverview.image.active ? { provider: providerOverview.image.active } : {}),
      ...(Object.keys(style).length > 0 ? { style } : {}),
    };

    imageMutation.mutate(payload, {
      onSuccess: (result) => {
        const record: WorkflowImageRecord = {
          ...result,
          generatedAt: new Date().toISOString(),
          copyText: selectedCopy.text,
        };

        setImages((previous) => [record, ...previous]);
        toast({
          title: t("features:copyWorkflow.toasts.imageReady.title"),
          description: t("features:copyWorkflow.toasts.imageReady.description", {
            provider: findProviderLabel(providerOverview, "image", result.provider),
          }),
          status: "success",
          duration: 3500,
          isClosable: true,
        });
      },
      onError: (error) => {
        toast({
          title: t("features:copyWorkflow.toasts.imageFailed.title"),
          description: getErrorMessage(error, fallbackErrorMessage),
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      },
    });
  };

  const handleSaveProviders = async (payload: UpdateActiveProvidersPayload) => {
    try {
      await updateProvidersMutation.mutateAsync(payload);
      toast({
        title: t("features:copyWorkflow.toasts.providersUpdated.title"),
        description: t("features:copyWorkflow.toasts.providersUpdated.description"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      settingsDisclosure.onClose();
    } catch (error) {
      toast({
        title: t("features:copyWorkflow.toasts.providersFailed.title"),
        description: getErrorMessage(error, fallbackErrorMessage),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const textProviderLabel = findProviderLabel(providerOverview, "text", copyProvider);
  const imageProviderLabel = findProviderLabel(providerOverview, "image");

  return (
    <Stack spacing={8}>
      <HStack justify="space-between" align="flex-start" flexWrap="wrap" spacing={4}>
        <Stack spacing={1}>
          <Text fontWeight="semibold">{t("features:copyWorkflow.activeProviders.title")}</Text>
          <Text fontSize="sm" color="subtle">
            {t("features:copyWorkflow.activeProviders.summary", {
              textProvider: textProviderLabel,
              imageProvider: imageProviderLabel,
            })}
          </Text>
        </Stack>
        <Button
          variant="soft"
          size="sm"
          leftIcon={<AppIcon name="settings" boxSize={4} />}
          onClick={settingsDisclosure.onOpen}
        >
          {t("features:copyWorkflow.activeProviders.manageButton")}
        </Button>
      </HStack>

      <TopicInput isLoading={copyMutation.isPending} onSubmit={handleGenerateCopy} />

      <CopySuggestionsList
        copies={copies}
        metadata={copyMetadata}
        providerName={textProviderLabel}
        selectedId={selectedCopyId}
        onSelect={setSelectedCopyId}
        onCopyChange={handleCopyChange}
        isLoading={copyMutation.isPending}
        error={copyMutation.isError ? getErrorMessage(copyMutation.error, fallbackErrorMessage) : null}
        onRetry={handleRetryCopy}
        hasRequested={hasRequestedCopy}
      />

      <ImageConfirmationStep
        selectedCopy={selectedCopy}
        onGenerate={handleGenerateImage}
        providerName={imageProviderLabel}
        isDisabled={copyMutation.isPending || !selectedCopy}
        isLoading={imageMutation.isPending}
        error={imageMutation.isError ? getErrorMessage(imageMutation.error, fallbackErrorMessage) : null}
      />

      <GeneratedImagesGallery images={images} />

      <ProviderSettingsDrawer
        isOpen={settingsDisclosure.isOpen}
        onClose={settingsDisclosure.onClose}
        overview={providerOverview}
        isSubmitting={updateProvidersMutation.isPending}
        onSave={handleSaveProviders}
      />
    </Stack>
  );
};
