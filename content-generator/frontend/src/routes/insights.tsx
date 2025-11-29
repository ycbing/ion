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

import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";

const sentimentBreakdown = [
  { label: "Positive", value: 68, color: "brand.500" },
  { label: "Neutral", value: 22, color: "ink.400" },
  { label: "Constructive", value: 10, color: "ink.300" },
];

const growthTimeline = [
  {
    label: "Saved moodboards",
    value: "+34%",
    detail: "Creators are bookmarking more product storytelling references",
  },
  {
    label: "Carousel completion",
    value: "92%",
    detail: "Draft-to-publish rate for how-to sequences this week",
  },
  {
    label: "Avg. save rate",
    value: "6.8x",
    detail: "Versus lifestyle benchmark for the same period",
  },
];

export const InsightsPage = () => (
  <PageShell
    title="Campaign insights"
    subtitle="Stay ahead of community sentiment, optimise creator briefs, and double down on high-performing narratives."
    actions={
      <Fragment>
        <Button variant="ghost" size="sm" leftIcon={<AppIcon name="trend" boxSize={4} />}>
          Export report
        </Button>
        <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
          Create dashboard
        </Button>
      </Fragment>
    }
  >
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
      {[
        {
          label: "Weekly reach",
          value: "2.6M",
          helpText: "+18.2% vs last week",
          icon: "trend" as const,
        },
        {
          label: "Engagement depth",
          value: "4m 12s",
          helpText: "Avg. watch time on story-led videos",
          icon: "clock" as const,
        },
        {
          label: "Save to share",
          value: "1.9x",
          helpText: "Saves vs shares on hero posts",
          icon: "sparkles" as const,
        },
      ].map((stat) => (
        <SectionCard key={stat.label} icon={stat.icon}>
          <Stat>
            <StatLabel color="subtle">{stat.label}</StatLabel>
            <StatNumber>{stat.value}</StatNumber>
            <StatHelpText color="brand.500">{stat.helpText}</StatHelpText>
          </Stat>
        </SectionCard>
      ))}
    </SimpleGrid>

    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
      <SectionCard
        title="Sentiment pulse"
        description="How your community feels about current talking points on Xiaohongshu."
        icon="insights"
      >
        <Stack spacing={4}>
          {sentimentBreakdown.map((sentiment) => (
            <Stack key={sentiment.label} spacing={1}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="medium">{sentiment.label}</Text>
                <Badge colorScheme="brand" variant="subtle">
                  {sentiment.value}%
                </Badge>
              </HStack>
              <Progress
                value={sentiment.value}
                size="sm"
                colorScheme={sentiment.label === "Positive" ? "brand" : "gray"}
                borderRadius="pill"
              />
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SectionCard
        title="Momentum signals"
        description="Recent wins and areas to optimise based on performance data."
        icon="shield"
      >
        <Stack spacing={4}>
          {growthTimeline.map((item, index) => (
            <Stack key={item.label} spacing={2}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="medium">{item.label}</Text>
                <Badge colorScheme="brand" variant="subtle">
                  {item.value}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="subtle">
                {item.detail}
              </Text>
              {index < growthTimeline.length - 1 ? (
                <Divider borderColor="ink.100" />
              ) : null}
            </Stack>
          ))}
        </Stack>
      </SectionCard>
    </SimpleGrid>
  </PageShell>
);
