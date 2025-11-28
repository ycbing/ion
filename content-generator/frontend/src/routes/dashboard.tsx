import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import {
  FormSelectField,
  FormTextField,
  FormTextareaField,
} from "@/components/form";
import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";
import { CopyWorkflow } from "@/features/copy-workflow";
import { providerOverviewFallback, useProviderOverview } from "@/features/providers";

const primaryChannelOptions = [
  { label: "Xiaohongshu", value: "xiaohongshu" },
  { label: "Douyin", value: "douyin" },
  { label: "Weibo", value: "weibo" },
  { label: "Instagram", value: "instagram" },
];

const toneOptions = [
  { label: "Warm & conversational", value: "warm" },
  { label: "Minimal & editorial", value: "minimal" },
  { label: "Playful & upbeat", value: "playful" },
  { label: "Luxury & polished", value: "luxury" },
];

const highlights = [
  {
    label: "Creator reach",
    value: "1.8M",
    change: "+12.4%",
    icon: "trend" as const,
  },
  {
    label: "Drafts in review",
    value: "8",
    change: "3 ready today",
    icon: "feather" as const,
  },
  {
    label: "Launch velocity",
    value: "92%",
    change: "Ahead of target",
    icon: "flame" as const,
  },
];

const inspirationSnippets = [
  "Weekend escape packing checklist",
  "5AM skincare before sunrise hike",
  "Muted blush palette for café hopping",
];

export const DashboardPage = () => {
  const { data: providerOverviewData, isFetching } = useProviderOverview();
  const providerOverview = providerOverviewData ?? providerOverviewFallback;
  const providerDomains = [
    {
      key: "text" as const,
      title: "Text generation",
      summary: providerOverview.text,
    },
    {
      key: "image" as const,
      title: "Image generation",
      summary: providerOverview.image,
    },
  ];

  return (
    <PageShell
      title="Creative dashboard"
      subtitle="Curate product stories, align creator campaigns, and preview assets before each Xiaohongshu drop."
      actions={
        <Fragment>
          <Button variant="ghost" size="sm" leftIcon={<AppIcon name="wand" boxSize={4} />}>
            Inspire me
          </Button>
          <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
            New concept
          </Button>
        </Fragment>
      }
    >
      <SectionCard
        title="Copy-to-image studio"
        description="Brief a topic, pick your favourite AI copy, then render hero visuals in one flow."
        icon="wand"
      >
        <CopyWorkflow />
      </SectionCard>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 8 }}>
        <SectionCard
          title="Launch narrative"
          description="Define the emotional hook, tone, and distribution cadence for your next spotlight."
          icon="sparkles"
          actions={
            <Button variant="soft" size="sm" leftIcon={<AppIcon name="palette" boxSize={4} />}>
              Browse templates
            </Button>
          }
        >
          <Stack spacing={4}>
            <FormTextField
              label="Campaign headline"
              placeholder="Tease the weekender drop with dawn-toned nostalgia"
            />
            <FormSelectField
              label="Primary channel"
              options={primaryChannelOptions}
              placeholder="Select a platform"
            />
            <FormSelectField label="Tone" options={toneOptions} placeholder="Select tone" />
            <FormTextareaField
              label="Story direction"
              placeholder="Outline the hook, hero shots, and call-to-action you want creators to riff on."
              rows={4}
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title="Active providers"
          description="Connected models powering ideation and sentiment checks."
          icon="dashboard"
        >
          <Stack spacing={4}>
            {providerDomains.map(({ key, title, summary }) => {
              const activeLabel =
                summary.providers.find((provider) => provider.name === summary.active)?.label ??
                summary.active;

              return (
                <Stack
                  key={key}
                  spacing={3}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="ink.100"
                  p={4}
                >
                  <HStack justify="space-between" align="flex-start">
                    <Stack spacing={1}>
                      <Text fontWeight="semibold">{title}</Text>
                      <Text fontSize="sm" color="subtle">
                        Active: {activeLabel}
                      </Text>
                    </Stack>
                    <Badge colorScheme="brand" variant="subtle">
                      {summary.providers.length} option{summary.providers.length === 1 ? "" : "s"}
                    </Badge>
                  </HStack>
                  <Stack spacing={3}>
                    {summary.providers.map((provider) => (
                      <HStack key={provider.name} justify="space-between" align="flex-start">
                        <Stack spacing={0} flex="1">
                          <Text fontWeight="medium">{provider.label}</Text>
                          <Text fontSize="sm" color="subtle">
                            Driver: {provider.driver}
                          </Text>
                        </Stack>
                        <Badge
                          variant={provider.isActive ? "solid" : "subtle"}
                          colorScheme={
                            provider.isActive
                              ? "brand"
                              : provider.missingCredentials.length > 0
                              ? "red"
                              : "green"
                          }
                        >
                          {provider.isActive
                            ? "Active"
                            : provider.missingCredentials.length > 0
                            ? "Credentials"
                            : "Ready"}
                        </Badge>
                      </HStack>
                    ))}
                  </Stack>
                </Stack>
              );
            })}
            {isFetching ? <Skeleton h="20px" borderRadius="md" /> : null}
          </Stack>
        </SectionCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 6 }}>
        {highlights.map((highlight) => (
          <SectionCard key={highlight.label} icon={highlight.icon}>
            <Stat>
              <StatLabel color="subtle">{highlight.label}</StatLabel>
              <StatNumber>{highlight.value}</StatNumber>
              <StatHelpText color="brand.500">{highlight.change}</StatHelpText>
            </Stat>
          </SectionCard>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 8 }}>
        <SectionCard
          title="Creator spotlights"
          description="Keep tabs on your top storytellers and their next deliverables."
          icon="feather"
        >
          <Stack spacing={4}>
            {["Avery Lee", "Jun Park", "Mina Zhao"].map((creator, index) => (
              <HStack key={creator} align="center" spacing={4}>
                <Avatar name={creator} size="sm" bg="brand.500" color="white" />
                <Box flex="1">
                  <Text fontWeight="medium">{creator}</Text>
                  <Text fontSize="sm" color="subtle">
                    {index === 0
                      ? "Sunrise skincare vlog • Due tomorrow"
                      : index === 1
                        ? "City café photo diary • Draft present"
                        : "Capsule closet carousel • In review"}
                  </Text>
                </Box>
                <Badge colorScheme="brand" variant="subtle">
                  {index === 0 ? "Filming" : index === 1 ? "Editing" : "Review"}
                </Badge>
              </HStack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          title="Inspiration feed"
          description="Snippets trending within your segment. Save to moodboard or push to a brief."
          icon="flame"
          actions={
            <Button variant="ghost" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
              Add to moodboard
            </Button>
          }
        >
          <Stack spacing={4}>
            {inspirationSnippets.map((snippet) => (
              <Stack key={snippet} spacing={1}>
                <HStack spacing={3}>
                  <AppIcon name="sparkles" boxSize={4} color="brand.500" />
                  <Text fontWeight="medium">{snippet}</Text>
                </HStack>
                <Text fontSize="sm" color="subtle">
                  Tap to view suggested angles and recommended creator pairings.
                </Text>
                <Divider borderColor="ink.100" />
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>
    </PageShell>
  );
};
