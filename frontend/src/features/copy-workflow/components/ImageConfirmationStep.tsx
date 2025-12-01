import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { CopySuggestion, ImageStyleOptions } from "../types";

const ASPECT_RATIO_OPTIONS = [
  { value: "1:1", labelKey: "copyWorkflow.imageForm.aspectRatio.square" },
  { value: "4:5", labelKey: "copyWorkflow.imageForm.aspectRatio.portrait" },
  { value: "16:9", labelKey: "copyWorkflow.imageForm.aspectRatio.widescreen" },
];

const parsePalette = (value: string): string[] | undefined => {
  const entries = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return entries.length > 0 ? entries : undefined;
};

type ImageConfirmationStepProps = {
  selectedCopy: CopySuggestion | null;
  onGenerate: (style: ImageStyleOptions) => void;
  providerName?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string | null;
};

export const ImageConfirmationStep = ({
  selectedCopy,
  onGenerate,
  providerName,
  isDisabled = false,
  isLoading = false,
  error,
}: ImageConfirmationStepProps) => {
  const { t } = useTranslation("features");

  const [palette, setPalette] = useState(() => t("copyWorkflow.imageForm.defaults.palette"));
  const [medium, setMedium] = useState(() => t("copyWorkflow.imageForm.defaults.medium"));
  const [mood, setMood] = useState(() => t("copyWorkflow.imageForm.defaults.mood"));
  const [aspectRatio, setAspectRatio] = useState("4:5");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCopy) {
      return;
    }

    const style: ImageStyleOptions = {};

    if (palette.trim()) {
      const parsedPalette = parsePalette(palette);
      if (parsedPalette) {
        style.palette = parsedPalette;
      }
    }

    if (medium.trim()) {
      style.medium = medium.trim();
    }

    if (mood.trim()) {
      style.mood = mood.trim();
    }

    if (aspectRatio) {
      style.aspectRatio = aspectRatio;
    }

    onGenerate(style);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Text fontWeight="semibold">{t("copyWorkflow.imageForm.title")}</Text>
          <Text fontSize="sm" color="subtle">
            {selectedCopy
              ? t("copyWorkflow.imageForm.subtitle.ready")
              : t("copyWorkflow.imageForm.subtitle.empty")}
          </Text>
        </Stack>

        <Textarea
          value={selectedCopy?.text ?? ""}
          isReadOnly
          placeholder={t("copyWorkflow.imageForm.copyPlaceholder")}
          rows={4}
        />

        <Stack spacing={4}>
          <FormControl>
            <FormLabel>{t("copyWorkflow.imageForm.fields.palette.label")}</FormLabel>
            <Input
              value={palette}
              onChange={(event) => setPalette(event.target.value)}
              placeholder={t("copyWorkflow.imageForm.fields.palette.placeholder")}
            />
            <FormHelperText>{t("copyWorkflow.imageForm.fields.palette.helper")}</FormHelperText>
          </FormControl>

          <HStack spacing={4} align="flex-start" flexWrap="wrap">
            <FormControl flex="1" minW={{ base: "100%", md: "220px" }}>
              <FormLabel>{t("copyWorkflow.imageForm.fields.medium.label")}</FormLabel>
              <Input
                value={medium}
                onChange={(event) => setMedium(event.target.value)}
                placeholder={t("copyWorkflow.imageForm.fields.medium.placeholder")}
              />
            </FormControl>

            <FormControl flex="1" minW={{ base: "100%", md: "220px" }}>
              <FormLabel>{t("copyWorkflow.imageForm.fields.mood.label")}</FormLabel>
              <Input
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                placeholder={t("copyWorkflow.imageForm.fields.mood.placeholder")}
              />
            </FormControl>

            <FormControl flex="1" minW={{ base: "100%", md: "220px" }}>
              <FormLabel>{t("copyWorkflow.imageForm.fields.aspectRatio.label")}</FormLabel>
              <Select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)}>
                {ASPECT_RATIO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`features:${option.labelKey}`)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>
        </Stack>

        {error ? (
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <HStack justify="space-between" align="center">
          <Text fontSize="sm" color="subtle">
            {providerName
              ? t("copyWorkflow.imageForm.providerHint", { provider: providerName })
              : t("copyWorkflow.imageForm.providerFallback")}
          </Text>
          <Button
            type="submit"
            variant="primary"
            isDisabled={isDisabled || !selectedCopy}
            isLoading={isLoading}
          >
            {t("copyWorkflow.imageForm.actions.generate")}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};
