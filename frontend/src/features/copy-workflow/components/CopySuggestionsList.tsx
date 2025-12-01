import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Box,
  Button,
  HStack,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import type { CopyGenerationMetadata, CopySuggestion } from "../types";

type CopySuggestionsListProps = {
  copies: CopySuggestion[];
  metadata?: CopyGenerationMetadata;
  providerName?: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCopyChange: (id: string, text: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasRequested?: boolean;
};

const LoadingState = () => (
  <Stack spacing={3}>
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} height="120px" borderRadius="xl" />
    ))}
  </Stack>
);

export const CopySuggestionsList = ({
  copies,
  metadata,
  providerName,
  selectedId,
  onSelect,
  onCopyChange,
  isLoading = false,
  error,
  onRetry,
  hasRequested = false,
}: CopySuggestionsListProps) => {
  const { t } = useTranslation("features");

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <AlertDescription display="flex" flexDir="column" gap={2}>
          <Text>{error}</Text>
          {onRetry ? (
            <Button size="sm" alignSelf="flex-start" variant="outline" onClick={onRetry}>
              {t("copyWorkflow.actions.retry")}
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasRequested) {
    return (
      <Box
        borderRadius="xl"
        border="1px dashed"
        borderColor="ink.100"
        p={6}
        textAlign="center"
        color="subtle"
      >
        <Text>{t("copyWorkflow.suggestions.emptyPrompt")}</Text>
      </Box>
    );
  }

  if (!copies.length) {
    return (
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <AlertDescription>
          {t("copyWorkflow.suggestions.noVariants")}
        </AlertDescription>
      </Alert>
    );
  }

  const deliveredVariants = metadata?.deliveredVariants ?? copies.length;

  return (
    <Stack spacing={4}>
      <HStack justify="space-between" align="center">
        <Stack spacing={0}>
          <Text fontWeight="semibold">{t("copyWorkflow.suggestions.title")}</Text>
          <Text fontSize="sm" color="subtle">
            {providerName
              ? t("copyWorkflow.suggestions.provider", { provider: providerName })
              : t("copyWorkflow.suggestions.providerFallback")}
          </Text>
        </Stack>
        <Badge colorScheme="brand" variant="subtle">
          {t("copyWorkflow.suggestions.variantCount", { count: deliveredVariants })}
        </Badge>
      </HStack>

      <RadioGroup value={selectedId ?? ""} onChange={(value) => onSelect(value)}>
        <Stack spacing={3}>
          {copies.map((copy) => {
            const isActive = copy.id === selectedId;

            return (
              <Box
                key={copy.id}
                borderRadius="xl"
                border="1px solid"
                borderColor={isActive ? "brand.200" : "ink.100"}
                bg={isActive ? "brand.50" : "surface"}
                p={4}
              >
                <Stack spacing={3}>
                  <HStack justify="space-between" align="flex-start">
                    <Radio value={copy.id}>{t("copyWorkflow.suggestions.useDirection")}</Radio>
                    <Badge colorScheme={isActive ? "brand" : "gray"} variant="subtle">
                      {isActive
                        ? t("copyWorkflow.suggestions.selected")
                        : t("copyWorkflow.suggestions.variant")}
                    </Badge>
                  </HStack>
                  <Textarea
                    value={copy.text}
                    onChange={(event) => onCopyChange(copy.id, event.target.value)}
                    rows={4}
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                  />
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </RadioGroup>
    </Stack>
  );
};
