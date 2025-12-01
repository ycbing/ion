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

import type { CopyGenerationOptions, GenerateCopyPayload } from "../types";

const toneOptions = [
  { label: "Warm & conversational", value: "warm" },
  { label: "Minimal & editorial", value: "minimal" },
  { label: "Playful & upbeat", value: "playful" },
  { label: "Luxury & polished", value: "luxury" },
];

const audienceOptions = [
  { label: "Gen Z urban explorers", value: "genz-explorers" },
  { label: "Weekend storytellers", value: "weekend-storytellers" },
  { label: "Wellness enthusiasts", value: "wellness" },
  { label: "Premium shoppers", value: "premium" },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "简体中文", value: "zh" },
  { label: "한국어", value: "ko" },
  { label: "日本語", value: "ja" },
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
  const [topic, setTopic] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [language, setLanguage] = useState("en");
  const [variants, setVariants] = useState(3);
  const [topicError, setTopicError] = useState<string | null>(null);

  const variantValue = useMemo(() => Math.min(Math.max(variants, 1), 5), [variants]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTopic = topic.trim();
    if (trimmedTopic.length < 3) {
      setTopicError("Topic must be at least 3 characters long");
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
          <FormLabel htmlFor="topic">Topic</FormLabel>
          <Input
            id="topic"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value);
              if (topicError) {
                setTopicError(null);
              }
            }}
            placeholder="E.g. Sunrise skincare ritual for hikers"
          />
          <FormHelperText>Summarise what you want the AI to ideate around.</FormHelperText>
          <FormErrorMessage>{topicError}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="creative-direction">Creative direction</FormLabel>
          <Textarea
            id="creative-direction"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Add context, product highlights, or CTA you want included."
            rows={3}
          />
        </FormControl>

        <Stack direction={{ base: "column", md: "row" }} spacing={4}>
          <FormControl>
            <FormLabel htmlFor="tone">Tone</FormLabel>
            <Select
              id="tone"
              placeholder="Select tone"
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
            <FormLabel htmlFor="audience">Audience</FormLabel>
            <Select
              id="audience"
              placeholder="Select audience"
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
            <FormLabel htmlFor="keywords">Keywords</FormLabel>
            <Input
              id="keywords"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="Separate keywords with commas"
            />
            <FormHelperText>Optional emphasis terms (max 12).</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="language">Language</FormLabel>
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
            <FormLabel htmlFor="variants">Variants</FormLabel>
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
            Generate copy ideas
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
