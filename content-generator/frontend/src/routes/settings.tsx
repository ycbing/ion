import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { Fragment } from "react";
import {
  FormSelectField,
  FormSwitchField,
  FormTextField,
  FormTextareaField,
} from "@/components/form";
import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";

const toneOptions = [
  { label: "Warm & conversational", value: "warm" },
  { label: "Minimal & editorial", value: "minimal" },
  { label: "Playful & upbeat", value: "playful" },
  { label: "Luxury & polished", value: "luxury" },
];

const cadenceOptions = [
  { label: "Daily", value: "daily" },
  { label: "Every other day", value: "alt" },
  { label: "Twice a week", value: "twice" },
  { label: "Weekly", value: "weekly" },
];

export const SettingsPage = () => (
  <PageShell
    title="Workspace settings"
    subtitle="Tailor the creative operating system to your brand and keep your notification flow intentional."
    actions={
      <Fragment>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm" leftIcon={<AppIcon name="shield" boxSize={4} />}>
          Save changes
        </Button>
      </Fragment>
    }
  >
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
      <SectionCard
        title="Workspace identity"
        description="Set the baseline information creators see across briefs and dashboards."
        icon="sparkles"
      >
        <Stack spacing={4}>
          <FormTextField label="Brand studio name" placeholder="Red Studio" />
          <FormTextField
            label="Contact email"
            type="email"
            placeholder="hello@redstudio.fake"
            helperText="Used for automated brief delivery."
          />
          <FormSelectField
            label="Default narrative tone"
            options={toneOptions}
            placeholder="Choose tone"
          />
          <FormTextareaField
            label="Brand pillars"
            placeholder="Outline the moments, keywords, and emotions that should guide creative."
            rows={4}
          />
        </Stack>
      </SectionCard>

      <SectionCard
        title="Notification cadence"
        description="Decide how your team hears about creator updates and sentiment shifts."
        icon="bell"
      >
        <Stack spacing={4}>
          <FormSelectField
            label="Digest cadence"
            options={cadenceOptions}
            placeholder="Select frequency"
            helperText="Summaries of creator activity and performance."
          />
          <FormSwitchField
            label="Instant alerts"
            helperText="Send push notifications for creator feedback and flagged drafts."
            defaultChecked
          />
          <FormSwitchField
            label="Provider health updates"
            helperText="Notify me if an AI provider is slow or unavailable."
          />
          <FormSwitchField
            label="Weekly inspiration pack"
            helperText="Receive a curated set of trending prompts and templates each Monday."
            defaultChecked
          />
        </Stack>
      </SectionCard>
    </SimpleGrid>
  </PageShell>
);
