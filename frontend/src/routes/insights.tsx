import {
  Badge,
  Button,
  Divider,
  HStack,
  Progress,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";

const SUMMARY_STATS = [
  {
    icon: "trend" as const,
    value: "2.6M",
    labelKey: "insights.summaryStats.weeklyReach.label",
    helpKey: "insights.summaryStats.weeklyReach.help",
  },
  {
    icon: "clock" as const,
    value: "4m 12s",
    labelKey: "insights.summaryStats.engagementDepth.label",
    helpKey: "insights.summaryStats.engagementDepth.help",
  },
  {
    icon: "sparkles" as const,
    value: "1.9x",
    labelKey: "insights.summaryStats.saveToShare.label",
    helpKey: "insights.summaryStats.saveToShare.help",
  },
];

const SENTIMENT_BREAKDOWN = [
  { value: 68, color: "brand.500", labelKey: "insights.sentiment.positive" },
  { value: 22, color: "ink.400", labelKey: "insights.sentiment.neutral" },
  { value: 10, color: "ink.300", labelKey: "insights.sentiment.constructive" },
];

const MOMENTUM_SIGNALS = [
  {
    labelKey: "insights.momentum.savedMoodboards.label",
    value: "+34%",
    detailKey: "insights.momentum.savedMoodboards.detail",
  },
  {
    labelKey: "insights.momentum.carouselCompletion.label",
    value: "92%",
    detailKey: "insights.momentum.carouselCompletion.detail",
  },
  {
    labelKey: "insights.momentum.averageSaveRate.label",
    value: "6.8x",
    detailKey: "insights.momentum.averageSaveRate.detail",
  },
];

export const InsightsPage = () => {
  const { t } = useTranslation(["pages", "common"]);

  return (
    <PageShell
      title={t("pages:insights.title")}
      subtitle={t("pages:insights.subtitle")}
      actions={
        <Fragment>
          <Button variant="ghost" size="sm" leftIcon={<AppIcon name="trend" boxSize={4} />}>
            {t("pages:insights.actions.exportReport")}
          </Button>
          <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
            {t("pages:insights.actions.createDashboard")}
          </Button>
        </Fragment>
      }
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
        {SUMMARY_STATS.map((stat) => (
          <SectionCard key={stat.labelKey} icon={stat.icon}>
            <Stat>
              <StatLabel color="subtle">{t(`pages:${stat.labelKey}`)}</StatLabel>
              <StatNumber>{stat.value}</StatNumber>
              <StatHelpText color="brand.500">{t(`pages:${stat.helpKey}`)}</StatHelpText>
            </Stat>
          </SectionCard>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
        <SectionCard
          title={t("pages:insights.sentimentPulse.title")}
          description={t("pages:insights.sentimentPulse.description")}
          icon="insights"
        >
          <Stack spacing={4}>
            {SENTIMENT_BREAKDOWN.map((sentiment) => (
              <Stack key={sentiment.labelKey} spacing={1}>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium">{t(`pages:${sentiment.labelKey}`)}</Text>
                  <Badge colorScheme="brand" variant="subtle">
                    {sentiment.value}%
                  </Badge>
                </HStack>
                <Progress
                  value={sentiment.value}
                  size="sm"
                  colorScheme={sentiment.color === "brand.500" ? "brand" : "gray"}
                  borderRadius="pill"
                />
              </Stack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:insights.momentumSignals.title")}
          description={t("pages:insights.momentumSignals.description")}
          icon="shield"
        >
          <Stack spacing={4}>
            {MOMENTUM_SIGNALS.map((item, index) => (
              <Stack key={item.labelKey} spacing={2}>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium">{t(`pages:${item.labelKey}`)}</Text>
                  <Badge colorScheme="brand" variant="subtle">
                    {item.value}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="subtle">
                  {t(`pages:${item.detailKey}`)}
                </Text>
                {index < MOMENTUM_SIGNALS.length - 1 ? <Divider borderColor="ink.100" /> : null}
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>
    </PageShell>
  );
};
