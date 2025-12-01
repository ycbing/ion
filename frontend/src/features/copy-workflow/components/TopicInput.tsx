import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type { CopyGenerationOptions, GenerateCopyPayload } from "../types";

const TONE_OPTION_KEYS = ["warm", "minimal", "playful", "luxury"] as const;

const AUDIENCE_OPTIONS = [
  { value: "genz-explorers", labelKey: "copyWorkflow.topicForm.audienceOptions.genzExplorers" },
  { value: "weekend-storytellers", labelKey: "copyWorkflow.topicForm.audienceOptions.weekendStorytellers" },
  { value: "wellness", labelKey: "copyWorkflow.topicForm.audienceOptions.wellness" },
  { value: "premium", labelKey: "copyWorkflow.topicForm.audienceOptions.premium" },
];

const LANGUAGE_OPTIONS = [
  { value: "zh", labelKey: "copyWorkflow.topicForm.languageOptions.zh" },
  { value: "en", labelKey: "copyWorkflow.topicForm.languageOptions.en" },
  { value: "ko", labelKey: "copyWorkflow.topicForm.languageOptions.ko" },
  { value: "ja", labelKey: "copyWorkflow.topicForm.languageOptions.ja" },
];

const parseKeywords = (value: string): string[] | undefined => {
  const entries = value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return entries.length > 0 ? entries : undefined;
};

const buildOptionsPayload = (
  tone: string,
  audience: string,
  keywords: string,
  language: string,
  variants: number,
): CopyGenerationOptions | undefined => {
  const payload: CopyGenerationOptions = {};

  if (tone) {
    payload.tone = tone;
  }

  if (audience) {
    payload.audience = audience;
  }

  const parsedKeywords = parseKeywords(keywords);
  if (parsedKeywords) {
    payload.keywords = parsedKeywords;
  }

  if (language) {
    payload.language = language;
  }

  if (variants) {
    payload.variants = variants;
  }

  return Object.keys(payload).length > 0 ? payload : undefined;
};

type TopicInputProps = {
  isLoading?: boolean;
  onSubmit: (payload: GenerateCopyPayload) => void;
};

export const TopicInput = ({ isLoading = false, onSubmit }: TopicInputProps) => {
  const { t, i18n } = useTranslation(["features", "common"]);
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState(() => (i18n.language.startsWith("zh") ? "zh" : "en"));
  const [variants, setVariants] = useState(3);
  const [topicError, setTopicError] = useState<string | null>(null);

  const variantValue = useMemo(() => Math.min(Math.max(variants, 1), 5), [variants]);

  const toneOptions = useMemo(
    () => TONE_OPTION_KEYS.map((key) => ({ value: key, label: t(`common:toneOptions.${key}`) })),
    [t],
  );

  const audienceOptions = useMemo(
    () => AUDIENCE_OPTIONS.map((option) => ({ value: option.value, label: t(`features:${option.labelKey}`) })),
    [t],
  );

  const languageOptions = useMemo(
    () => LANGUAGE_OPTIONS.map((option) => ({ value: option.value, label: t(`features:${option.labelKey}`) })),
    [t],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTopic = topic.trim();
    if (trimmedTopic.length < 3) {
      setTopicError(t("copyWorkflow.topicForm.errors.topicTooShort"));
      return;
    }

    const trimmedPrompt = prompt.trim();
    const options = buildOptionsPayload(tone, audience, keywords, language, variantValue);

    const payload: GenerateCopyPayload = {
      topic: trimmedTopic,
      ...(trimmedPrompt ? { prompt: trimmedPrompt } : {}),
      ...(options ? { options } : {}),
    };

    onSubmit(payload);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired isInvalid={Boolean(topicError)}>
          <FormLabel htmlFor="topic">{t("copyWorkflow.topicForm.fields.topic.label")}</FormLabel>
          <Input
            id="topic"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              if (topicError) {
                setTopicError(null);
              }
            }}
            placeholder={t("copyWorkflow.topicForm.fields.topic.placeholder")}
          />
          <FormHelperText>{t("copyWorkflow.topicForm.fields.topic.helper")}</FormHelperText>
          <FormErrorMessage>{topicError}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="creative-direction">
            {t("copyWorkflow.topicForm.fields.prompt.label")}
          </FormLabel>
          <Textarea
            id="creative-direction"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={t("copyWorkflow.topicForm.fields.prompt.placeholder")}
            rows={3}
          />
        </FormControl>

        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <FormControl>
            <FormLabel htmlFor="tone">{t("copyWorkflow.topicForm.fields.tone.label")}</FormLabel>
            <Select
              id="tone"
              placeholder={t("copyWorkflow.topicForm.fields.tone.placeholder")}
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="audience">{t("copyWorkflow.topicForm.fields.audience.label")}</FormLabel>
            <Select
              id="audience"
              placeholder={t("copyWorkflow.topicForm.fields.audience.placeholder")}
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <FormControl>
            <FormLabel htmlFor="keywords">{t("copyWorkflow.topicForm.fields.keywords.label")}</FormLabel>
            <Input
              id="keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder={t("copyWorkflow.topicForm.fields.keywords.placeholder")}
            />
            <FormHelperText>{t("copyWorkflow.topicForm.fields.keywords.helper")}</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="language">{t("copyWorkflow.topicForm.fields.language.label")}</FormLabel>
            <Select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="variants">{t("copyWorkflow.topicForm.fields.variants.label")}</FormLabel>
            <NumberInput
              min={1}
              max={5}
              value={variantValue}
              onChange={(_, valueAsNumber) => {
                if (Number.isNaN(valueAsNumber)) {
                  setVariants(1);
                } else {
                  setVariants(valueAsNumber);
                }
              }}
            >
              <NumberInputField id="variants" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Stack>

        <Stack direction={{ base: "column", md: "row" }} spacing={3} justify="flex-end">
          <Button type="submit" variant="primary" isLoading={isLoading} alignSelf="flex-end">
            {t("copyWorkflow.topicForm.actions.generate")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
