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

import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";

const upcomingCampaigns = [
  {
    id: "camp-1",
    name: "Midnight market pop-up",
    launchDate: "Dec 08",
    status: "In production",
    progress: 72,
    focus: "Streetfood-meets-skin",
  },
  {
    id: "camp-2",
    name: "Red holiday gifting",
    launchDate: "Dec 15",
    status: "Brief ready",
    progress: 45,
    focus: "Warm capsule moments",
  },
  {
    id: "camp-3",
    name: "Snowbound essentials",
    launchDate: "Dec 22",
    status: "Kickoff",
    progress: 28,
    focus: "Layered travel staples",
  },
];

const creatorPods = [
  {
    id: "pod-1",
    name: "Glow Lab",
    owners: ["Avery", "Linh", "Noor"],
    status: "Final tweaks",
  },
  {
    id: "pod-2",
    name: "City Sketchers",
    owners: ["Haruto", "Mia"],
    status: "Drafting",
  },
  {
    id: "pod-3",
    name: "Weekend Drifters",
    owners: ["Sora", "Nyari", "Leo"],
    status: "Ready to publish",
  },
];

export const CampaignsPage = () => (
  <PageShell
    title="Campaign planner"
    subtitle="Track every drop from brief to live moment, and keep creator pods aligned on deliverables."
    actions={
      <Fragment>
        <Button variant="ghost" size="sm" leftIcon={<AppIcon name="calendar" boxSize={4} />}>
          Calendar view
        </Button>
        <Button variant="primary" size="sm" leftIcon={<AppIcon name="plus" boxSize={4} />}>
          New launch
        </Button>
      </Fragment>
    }
  >
    <SectionCard
      title="Upcoming launches"
      description="Monitor velocity, stage, and focus area for the next wave of stories."
      icon="campaigns"
    >
      <Stack spacing={5}>
        {upcomingCampaigns.map((campaign) => (
          <Stack key={campaign.id} spacing={3} borderRadius="xl" border="1px solid" borderColor="ink.100" p={4}>
            <HStack justify="space-between" align="flex-start">
              <Stack spacing={1}>
                <Text fontWeight="semibold">{campaign.name}</Text>
                <Text fontSize="sm" color="subtle">
                  Focus: {campaign.focus}
                </Text>
              </Stack>
              <Badge colorScheme="brand" variant="subtle">
                {campaign.status}
              </Badge>
            </HStack>
            <HStack justify="space-between" align="center">
              <HStack spacing={3} color="subtle">
                <AppIcon name="calendar" boxSize={4} />
                <Text fontSize="sm">{campaign.launchDate}</Text>
              </HStack>
              <HStack spacing={3} color="subtle">
                <AppIcon name="clock" boxSize={4} />
                <Text fontSize="sm">{campaign.progress}% ready</Text>
              </HStack>
            </HStack>
            <Progress value={campaign.progress} colorScheme="brand" size="sm" borderRadius="pill" />
          </Stack>
        ))}
      </Stack>
    </SectionCard>

    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
      <SectionCard
        title="Creator pods"
        description="Sprint-based groups collaborating on each launch."
        icon="sparkles"
      >
        <Stack spacing={4}>
          {creatorPods.map((pod) => (
            <Stack key={pod.id} spacing={2} borderRadius="xl" border="1px solid" borderColor="ink.100" p={4}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="semibold">{pod.name}</Text>
                <Badge colorScheme="brand" variant="subtle">
                  {pod.status}
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
        title="Workflow automation"
        description="Pre-flight checks ensure every product story stays on brand."
        icon="shield"
        actions={
          <Button variant="soft" size="sm" leftIcon={<AppIcon name="bell" boxSize={4} />}>
            Notification rules
          </Button>
        }
      >
        <Stack spacing={4}>
          <HStack spacing={3} align="flex-start">
            <AppIcon name="wand" boxSize={5} color="brand.500" />
            <Stack spacing={1}>
              <Text fontWeight="medium">Tone check</Text>
              <Text fontSize="sm" color="subtle">
                Auto-review drafts for the "warm & conversational" tone before final delivery.
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={3} align="flex-start">
            <AppIcon name="trend" boxSize={5} color="brand.500" />
            <Stack spacing={1}>
              <Text fontWeight="medium">Trend sync</Text>
              <Text fontSize="sm" color="subtle">
                Surface top Xiaohongshu hashtag clusters relevant to your campaign focus.
              </Text>
            </Stack>
          </HStack>
          <HStack spacing={3} align="flex-start">
            <AppIcon name="flame" boxSize={5} color="brand.500" />
            <Stack spacing={1}>
              <Text fontWeight="medium">Escalation window</Text>
              <Text fontSize="sm" color="subtle">
                Notify approvers if drafts stay untouched for more than 36 hours.
              </Text>
            </Stack>
          </HStack>
        </Stack>
      </SectionCard>
    </SimpleGrid>
  </PageShell>
);
