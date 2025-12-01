import { Button, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  FormSelectField,
  FormSwitchField,
  FormTextField,
  FormTextareaField,
} from "@/components/form";
import { AppIcon } from "@/components/icons";
import { PageShell, SectionCard } from "@/components/layout";
import { SUPPORTED_LANGUAGES } from "@/config/i18n";

const TONE_OPTION_KEYS = ["warm", "minimal", "playful", "luxury"] as const;

const CADENCE_OPTION_KEYS = ["daily", "alternate", "twice", "weekly"] as const;

export const SettingsPage = () => {
  const { t, i18n } = useTranslation(["pages", "common"]);

  const toneOptions = useMemo(
    () => TONE_OPTION_KEYS.map((key) => ({ value: key, label: t(`common:toneOptions.${key}`) })),
    [t],
  );

  const cadenceOptions = useMemo(
    () =>
      CADENCE_OPTION_KEYS.map((key) => ({
        value: key,
        label: t(`pages:settings.notificationCadence.cadenceOptions.${key}`),
      })),
    [t],
  );

  const languageOptions = useMemo(
    () =>
      SUPPORTED_LANGUAGES.map((language) => ({
        value: language.value,
        label: t(`common:languages.${language.value}`),
      })),
    [t],
  );

  const handleLanguageChange = (value: string) => {
    void i18n.changeLanguage(value);
  };

  return (
    <PageShell
      title={t("pages:settings.title")}
      subtitle={t("pages:settings.subtitle")}
      actions={
        <Fragment>
          <Button variant="ghost" size="sm">
            {t("common:buttons.cancel")}
          </Button>
          <Button variant="primary" size="sm" leftIcon={<AppIcon name="shield" boxSize={4} />}>
            {t("pages:settings.actions.save")}
          </Button>
        </Fragment>
      }
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
        <SectionCard
          title={t("pages:settings.workspaceIdentity.title")}
          description={t("pages:settings.workspaceIdentity.description")}
          icon="sparkles"
        >
          <Stack spacing={4}>
            <FormTextField
              label={t("pages:settings.workspaceIdentity.form.brandName.label")}
              placeholder={t("pages:settings.workspaceIdentity.form.brandName.placeholder")}
            />
            <FormTextField
              label={t("pages:settings.workspaceIdentity.form.contactEmail.label")}
              type="email"
              placeholder={t("pages:settings.workspaceIdentity.form.contactEmail.placeholder")}
              helperText={t("pages:settings.workspaceIdentity.form.contactEmail.helper")}
            />
            <FormSelectField
              label={t("pages:settings.workspaceIdentity.form.defaultTone.label")}
              options={toneOptions}
              placeholder={t("common:form.selectTone")}
            />
            <FormTextareaField
              label={t("pages:settings.workspaceIdentity.form.brandPillars.label")}
              placeholder={t("pages:settings.workspaceIdentity.form.brandPillars.placeholder")}
              rows={4}
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:settings.notificationCadence.title")}
          description={t("pages:settings.notificationCadence.description")}
          icon="bell"
        >
          <Stack spacing={4}>
            <FormSelectField
              label={t("pages:settings.notificationCadence.form.digestCadence.label")}
              options={cadenceOptions}
              placeholder={t("pages:settings.notificationCadence.form.digestCadence.placeholder")}
              helperText={t("pages:settings.notificationCadence.form.digestCadence.helper")}
            />
            <FormSwitchField
              label={t("pages:settings.notificationCadence.form.instantAlerts.label")}
              helperText={t("pages:settings.notificationCadence.form.instantAlerts.helper")}
              defaultChecked
            />
            <FormSwitchField
              label={t("pages:settings.notificationCadence.form.providerHealth.label")}
              helperText={t("pages:settings.notificationCadence.form.providerHealth.helper")}
            />
            <FormSwitchField
              label={t("pages:settings.notificationCadence.form.weeklyInspiration.label")}
              helperText={t("pages:settings.notificationCadence.form.weeklyInspiration.helper")}
              defaultChecked
            />
          </Stack>
        </SectionCard>

        <SectionCard
          title={t("pages:settings.languagePreferences.title")}
          description={t("pages:settings.languagePreferences.description")}
          icon="globe"
        >
          <Stack spacing={4}>
            <FormSelectField
              label={t("pages:settings.languagePreferences.form.interfaceLanguage.label")}
              options={languageOptions}
              value={i18n.language}
              onChange={(event) => handleLanguageChange(event.target.value)}
            />
            <Text fontSize="sm" color="subtle">
              {t("pages:settings.languagePreferences.helperText")}
            </Text>
          </Stack>
        </SectionCard>
      </SimpleGrid>
    </PageShell>
  );
};
