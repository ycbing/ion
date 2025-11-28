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

import type { CopyGenerationMetadata, CopySuggestion } from "../types";

interface CopySuggestionsListProps {
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
}

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
              Try again
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
        <Text>Provide a topic to see tailored copy directions from your active AI provider.</Text>
      </Box>
    );
  }

  if (!copies.length) {
    return (
      <Alert status="warning" borderRadius="lg">
        <AlertIcon />
        <AlertDescription>
          No copy variants were returned. Adjust your brief and generate again.
        </AlertDescription>
      </Alert>
    );
  }

  const deliveredVariants = metadata?.deliveredVariants ?? copies.length;

  return (
    <Stack spacing={4}>
      <HStack justify="space-between" align="center">
        <Stack spacing={0}>
          <Text fontWeight="semibold">AI suggestions</Text>
          <Text fontSize="sm" color="subtle">
            {providerName ? `Powered by ${providerName}` : "Provider response"}
          </Text>
        </Stack>
        <Badge colorScheme="brand" variant="subtle">
          {deliveredVariants} {deliveredVariants === 1 ? "variant" : "variants"}
        </Badge>
      </HStack>

      <RadioGroup value={selectedId ?? ""} onChange={(value) => onSelect(value)}>
        <Stack spacing={3}>
          {copies.map((copy) => (
            <Box
              key={copy.id}
              borderRadius="xl"
              border="1px solid"
              borderColor={copy.id === selectedId ? "brand.200" : "ink.100"}
              bg={copy.id === selectedId ? "brand.50" : "surface"}
              p={4}
            >
              <Stack spacing={3}>
                <HStack justify="space-between" align="flex-start">
                  <Radio value={copy.id}>Use this direction</Radio>
                  <Badge colorScheme={copy.id === selectedId ? "brand" : "gray"} variant="subtle">
                    {copy.id === selectedId ? "Selected" : "Variant"}
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
          ))}
        </Stack>
      </RadioGroup>
    </Stack>
  );
};
