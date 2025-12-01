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
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  FormSelectField,
  FormTextField,
  FormTextareaField,
} from "@/components/form";
import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";
import { CopyWorkflow } from "@/features/copy-workflow";
import { providerOverviewFallback, useProviderOverview } from "@/features/providers";

const PRIMARY_CHANNEL_OPTIONS = [
  {
    value: "xiaohongshu",
    labelKey:
      "dashboard.launchNarrative.form.primaryChannel.options.xiaohongshu",
  },
  {
    value: "douyin",
    labelKey: "dashboard.launchNarrative.form.primaryChannel.options.douyin",
  },
  {
    value: "weibo",
    labelKey: "dashboard.launchNarrative.form.primaryChannel.options.weibo",
  },
  {
    value: "instagram",
    labelKey:
      "dashboard.launchNarrative.form.primaryChannel.options.instagram",
  },
];

const TONE_OPTION_KEYS = ["warm", "minimal", "playful", "luxury"] as const;

const HIGHLIGHTS = [
  {
    icon: "trend" as const,
    value: "1.8M",
    labelKey: "dashboard.highlights.creatorReach.label",
    changeKey: "dashboard.highlights.creatorReach.change",
  },
  {
    icon: "feather" as const,
    value: "8",
    labelKey: "dashboard.highlights.draftsInReview.label",
    changeKey: "dashboard.highlights.draftsInReview.change",
  },
  {
    icon: "flame" as const,
    value: "92%",
    labelKey: "dashboard.highlights.launchVelocity.label",
    changeKey: "dashboard.highlights.launchVelocity.change",
  },
];

const CREATOR_SPOTLIGHTS = [
  {
    name: "Avery Lee",
    descriptionKey: "dashboard.creatorSpotlights.items.avery.description",
    statusKey: "common:status.filming",
  },
  {
    name: "Jun Park",
    descriptionKey: "dashboard.creatorSpotlights.items.jun.description",
    statusKey: "common:status.editing",
  },
  {
    name: "Mina Zhao",
    descriptionKey: "dashboard.creatorSpotlights.items.mina.description",
    statusKey: "common:status.review",
  },
];

const INSPIRATION_SNIPPETS = [
  "dashboard.inspirationFeed.snippets.weekendEscape",
  "dashboard.inspirationFeed.snippets.sunriseSkincare",
  "dashboard.inspirationFeed.snippets.mutedBlushPalette",
];

export const DashboardPage = () => {
  const { t, i18n } = useTranslation(["pages", "common"]);
  const { data: providerOverviewData, isFetching } = useProviderOverview();
  const providerOverview = providerOverviewData ?? providerOverviewFallback;

  const listFormatter = useMemo(
    () => new Intl.ListFormat(i18n.language, { style: "long", type: "conjunction" }),
    [i18n.language],
  );

  const providerDomains = (['text', 'image'] as const).map((key) => ({
    key,
    title: t(`pages:dashboard.activeProviders.domains.${key}`),
    summary: providerOverview[key],
  }));

  const primaryChannelOptions = PRIMARY_CHANNEL_OPTIONS.map((option) => ({
    value: option.value,
    label: t(`pages:${option.labelKey}`),
  }));

  const toneOptions = TONE_OPTION_KEYS.map((key) => ({
    value: key,
    label: t(`common:toneOptions.${key}`),
  }));

  const highlightItems = HIGHLIGHTS.map((item) => ({
    ...item,
    label: t(`pages:${item.labelKey}`),
    change: t(`pages:${item.changeKey}`),
  }));

  const creatorSpotlights = CREATOR_SPOTLIGHTS.map((item) => ({
    name: item.name,
    description: t(`pages:${item.descriptionKey}`),
    status: t(item.statusKey),
  }));

  const inspirationSnippets = INSPIRATION_SNIPPETS.map((key) => t(`pages:${key}`));

  const formatMissingCredentials = (credentials: string[]) =>
    credentials.length > 0 ? listFormatter.format(credentials) : "";

  return (
    <PageShell
      title={t("pages:dashboard.title")}
      subtitle={t("pages:dashboard.subtitle")}
      actions={
        <Fragment>
          <Button variant="ghost" size="sm" leftIcon={<AppIcon name="wand" boxSize={4} />}>
            {t("pages:dashboard.actions.inspire")}
          </Button>
          <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
            {t("pages:dashboard.actions.newConcept")}
          </Button>
        </Fragment>
      }
    >
      <SectionCard
        title={t("pages:dashboard.copyToImage.title")}
        description={t("pages:dashboard.copyToImage.description")}
        icon="wand"
      >
        <CopyWorkflow />
      </SectionCard>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 8 }}>
        <SectionCard
          title={t("pages:dashboard.launchNarrative.title")}
          description={t("pages:dashboard.launchNarrative.description")}
          icon="sparkles"
          actions={
            <Button variant="soft" size="sm" leftIcon={<AppIcon name="palette" boxSize={4} />}>
              {t("pages:dashboard.launchNarrative.actions.browseTemplates")}
            </Button>
          }
        >
          <Stack spacing={4}>
            <FormTextField
              label={t("pages:dashboard.launchNarrative.form.headline.label")}
              placeholder={t("pages:dashboard.launchNarrative.form.headline.placeholder")}
            />
            <FormSelectField
              label={t("pages:dashboard.launchNarrative.form.primaryChannel.label")}
              options={primaryChannelOptions}
              placeholder={t("pages:dashboard.launchNarrative.form.primaryChannel.placeholder")}
            />
            <FormSelectField
              label={t("pages:dashboard.launchNarrative.form.tone.label")}
              options={toneOptions}
              placeholder={t("common:form.selectTone")}
            />
            <FormTextareaField
              label={t("pages:dashboard.launchNarrative.form.storyDirection.label")}
              placeholder={t("pages:dashboard.launchNarrative.form.storyDirection.placeholder")}
              rows={4}
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:dashboard.activeProviders.title")}
          description={t("pages:dashboard.activeProviders.description")}
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
                        {t("pages:dashboard.activeProviders.activeLabel", { provider: activeLabel })}
                      </Text>
                    </Stack>
                    <Badge colorScheme="brand" variant="subtle">
                      {t("common:labels.options", { count: summary.providers.length })}
                    </Badge>
                  </HStack>
                  <Stack spacing={3}>
                    {summary.providers.map((provider) => {
                      const statusLabel = provider.isActive
                        ? t("common:status.active")
                        : provider.missingCredentials.length > 0
                        ? t("common:status.credentialsRequired")
                        : t("common:status.ready");

                      return (
                        <HStack key={provider.name} justify="space-between" align="flex-start">
                          <Stack spacing={0} flex="1">
                            <Text fontWeight="medium">{provider.label}</Text>
                            <Text fontSize="sm" color="subtle">
                              {t("pages:dashboard.activeProviders.driver", { driver: provider.driver })}
                            </Text>
                            {provider.missingCredentials.length > 0 ? (
                              <Text fontSize="sm" color="subtle">
                                {t("pages:dashboard.activeProviders.missing", {
                                  credentials: formatMissingCredentials(provider.missingCredentials),
                                })}
                              </Text>
                            ) : null}
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
                            {statusLabel}
                          </Badge>
                        </HStack>
                      );
                    })}
                  </Stack>
                </Stack>
              );
            })}
            {isFetching ? <Skeleton h="20px" borderRadius="md" /> : null}
          </Stack>
        </SectionCard>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 6 }}>
        {highlightItems.map((highlight) => (
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
          title={t("pages:dashboard.creatorSpotlights.title")}
          description={t("pages:dashboard.creatorSpotlights.description")}
          icon="feather"
        >
          <Stack spacing={4}>
            {creatorSpotlights.map((creator, index) => (
              <HStack key={`${creator.name}-${index}`} align="center" spacing={4}>
                <Avatar name={creator.name} size="sm" bg="brand.500" color="white" />
                <Box flex="1">
                  <Text fontWeight="medium">{creator.name}</Text>
                  <Text fontSize="sm" color="subtle">
                    {creator.description}
                  </Text>
                </Box>
                <Badge colorScheme="brand" variant="subtle">
                  {creator.status}
                </Badge>
              </HStack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:dashboard.inspirationFeed.title")}
          description={t("pages:dashboard.inspirationFeed.description")}
          icon="flame"
          actions={
            <Button variant="ghost" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
              {t("pages:dashboard.inspirationFeed.actions.addToMoodboard")}
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
                  {t("pages:dashboard.inspirationFeed.helperText")}
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
