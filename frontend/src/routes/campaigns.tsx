import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";

const UPCOMING_CAMPAIGNS = [
  {
    id: "camp-1",
    nameKey: "campaigns.upcomingLaunches.items.midnightMarket.name",
    statusKey: "campaigns.upcomingLaunches.items.midnightMarket.status",
    focusKey: "campaigns.upcomingLaunches.items.midnightMarket.focus",
    launchDateKey: "campaigns.upcomingLaunches.items.midnightMarket.launchDate",
    progress: 72,
  },
  {
    id: "camp-2",
    nameKey: "campaigns.upcomingLaunches.items.holidayGifting.name",
    statusKey: "campaigns.upcomingLaunches.items.holidayGifting.status",
    focusKey: "campaigns.upcomingLaunches.items.holidayGifting.focus",
    launchDateKey: "campaigns.upcomingLaunches.items.holidayGifting.launchDate",
    progress: 45,
  },
  {
    id: "camp-3",
    nameKey: "campaigns.upcomingLaunches.items.snowboundEssentials.name",
    statusKey: "campaigns.upcomingLaunches.items.snowboundEssentials.status",
    focusKey: "campaigns.upcomingLaunches.items.snowboundEssentials.focus",
    launchDateKey: "campaigns.upcomingLaunches.items.snowboundEssentials.launchDate",
    progress: 28,
  },
];

const CREATOR_PODS = [
  {
    id: "pod-1",
    nameKey: "campaigns.creatorPods.items.glowLab.name",
    owners: ["Avery", "Linh", "Noor"],
    statusKey: "campaigns.creatorPods.items.glowLab.status",
  },
  {
    id: "pod-2",
    nameKey: "campaigns.creatorPods.items.citySketchers.name",
    owners: ["Haruto", "Mia"],
    statusKey: "campaigns.creatorPods.items.citySketchers.status",
  },
  {
    id: "pod-3",
    nameKey: "campaigns.creatorPods.items.weekendDrifters.name",
    owners: ["Sora", "Nyari", "Leo"],
    statusKey: "campaigns.creatorPods.items.weekendDrifters.status",
  },
];

const WORKFLOW_AUTOMATIONS = [
  {
    icon: "wand" as const,
    titleKey: "campaigns.workflowAutomation.items.toneCheck.title",
    descriptionKey: "campaigns.workflowAutomation.items.toneCheck.description",
  },
  {
    icon: "trend" as const,
    titleKey: "campaigns.workflowAutomation.items.trendSync.title",
    descriptionKey: "campaigns.workflowAutomation.items.trendSync.description",
  },
  {
    icon: "flame" as const,
    titleKey: "campaigns.workflowAutomation.items.escalation.title",
    descriptionKey: "campaigns.workflowAutomation.items.escalation.description",
  },
];

export const CampaignsPage = () => {
  const { t } = useTranslation(["pages", "common"]);

  return (
    <PageShell
      title={t("pages:campaigns.title")}
      subtitle={t("pages:campaigns.subtitle")}
      actions={
        <Fragment>
          <Button variant="ghost" size="sm" leftIcon={<AppIcon name="calendar" boxSize={4} />}>
            {t("pages:campaigns.actions.calendarView")}
          </Button>
          <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
            {t("pages:campaigns.actions.newLaunch")}
          </Button>
        </Fragment>
      }
    >
      <SectionCard
        title={t("pages:campaigns.upcomingLaunches.title")}
        description={t("pages:campaigns.upcomingLaunches.description")}
        icon="campaigns"
      >
        <Stack spacing={5}>
          {UPCOMING_CAMPAIGNS.map((campaign) => (
            <Stack key={campaign.id} spacing={3} borderRadius="xl" border="1px solid" borderColor="ink.100" p={4}>
              <HStack justify="space-between" align="flex-start">
                <Stack spacing={1}>
                  <Text fontWeight="semibold">{t(`pages:${campaign.nameKey}`)}</Text>
                  <Text fontSize="sm" color="subtle">
                    {t("pages:campaigns.upcomingLaunches.focusLabel", {
                      focus: t(`pages:${campaign.focusKey}`),
                    })}
                  </Text>
                </Stack>
                <Badge colorScheme="brand" variant="subtle">
                  {t(`pages:${campaign.statusKey}`)}
                </Badge>
              </HStack>
              <HStack justify="space-between" align="center">
                <HStack spacing={3} color="subtle">
                  <AppIcon name="calendar" boxSize={4} />
                  <Text fontSize="sm">{t(`pages:${campaign.launchDateKey}`)}</Text>
                </HStack>
                <HStack spacing={3} color="subtle">
                  <AppIcon name="clock" boxSize={4} />
                  <Text fontSize="sm">
                    {t("pages:campaigns.upcomingLaunches.progressLabel", {
                      value: campaign.progress,
                    })}
                  </Text>
                </HStack>
              </HStack>
              <Progress value={campaign.progress} colorScheme="brand" size="sm" borderRadius="pill" />
            </Stack>
          ))}
        </Stack>
      </SectionCard>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
        <SectionCard
          title={t("pages:campaigns.creatorPods.title")}
          description={t("pages:campaigns.creatorPods.description")}
          icon="sparkles"
        >
          <Stack spacing={4}>
            {CREATOR_PODS.map((pod) => (
              <Stack key={pod.id} spacing={2} borderRadius="xl" border="1px solid" borderColor="ink.100" p={4}>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="semibold">{t(`pages:${pod.nameKey}`)}</Text>
                  <Badge colorScheme="brand" variant="subtle">
                    {t(`pages:${pod.statusKey}`)}
                  </Badge>
                </HStack>
                <AvatarGroup size="sm" max={4}>
                  {pod.owners.map((owner) => (
                    <Avatar key={owner} name={owner} bg="brand.500" color="white" />
                  ))}
                </AvatarGroup>
              </Stack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:campaigns.workflowAutomation.title")}
          description={t("pages:campaigns.workflowAutomation.description")}
          icon="shield"
          actions={
            <Button variant="soft" size="sm" leftIcon={<AppIcon name="bell" boxSize={4} />}>
              {t("pages:campaigns.workflowAutomation.actions.notificationRules")}
            </Button>
          }
        >
          <Stack spacing={4}>
            {WORKFLOW_AUTOMATIONS.map((item) => (
              <HStack key={item.titleKey} spacing={3} align="flex-start">
                <AppIcon name={item.icon} boxSize={5} color="brand.500" />
                <Stack spacing={1}>
                  <Text fontWeight="medium">{t(`pages:${item.titleKey}`)}</Text>
                  <Text fontSize="sm" color="subtle">
                    {t(`pages:${item.descriptionKey}`)}
                  </Text>
                </Stack>
              </HStack>
            ))}
          </Stack>
        </SectionCard>
      </SimpleGrid>
    </PageShell>
  );
};
