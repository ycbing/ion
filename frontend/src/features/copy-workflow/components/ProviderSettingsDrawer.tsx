import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  ProviderDomain,
  ProviderOverview,
  ProviderSummary,
  UpdateActiveProvidersPayload,
} from "@/features/providers";

type ProviderSettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  overview: ProviderOverview;
  isSubmitting: boolean;
  onSave: (payload: UpdateActiveProvidersPayload) => Promise<void> | void;
};

const DOMAIN_KEYS: Record<ProviderDomain, string> = {
  text: "copyWorkflow.providerSettings.domains.text",
  image: "copyWorkflow.providerSettings.domains.image",
};

const DOMAIN_ORDER: ProviderDomain[] = ["text", "image"];

const hasChanges = (
  textSelection: string,
  imageSelection: string,
  overview: ProviderOverview,
): boolean =>
  textSelection !== overview.text.active || imageSelection !== overview.image.active;

export const ProviderSettingsDrawer = ({
  isOpen,
  onClose,
  overview,
  isSubmitting,
  onSave,
}: ProviderSettingsDrawerProps) => {
  const { t } = useTranslation(["features", "common"]);
  const [textSelection, setTextSelection] = useState(overview.text.active);
  const [imageSelection, setImageSelection] = useState(overview.image.active);

  useEffect(() => {
    if (isOpen) {
      setTextSelection(overview.text.active);
      setImageSelection(overview.image.active);
    }
  }, [isOpen, overview.image.active, overview.text.active]);

  const saveDisabled = useMemo(
    () => !hasChanges(textSelection, imageSelection, overview),
    [imageSelection, overview, textSelection],
  );

  const handleSave = async () => {
    const payload: UpdateActiveProvidersPayload = {};

    if (textSelection !== overview.text.active) {
      payload.text = textSelection;
    }

    if (imageSelection !== overview.image.active) {
      payload.image = imageSelection;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    await onSave(payload);
  };

  const renderProviderBadge = (provider: ProviderSummary) => {
    if (provider.isActive) {
      return (
        <Badge colorScheme="brand" variant="solid">
          {t("common:status.active")}
        </Badge>
      );
    }

    if (provider.missingCredentials.length > 0) {
      return (
        <Badge colorScheme="red" variant="subtle">
          {t("common:status.credentialsRequired")}
        </Badge>
      );
    }

    return (
      <Badge colorScheme="green" variant="subtle">
        {t("common:status.ready")}
      </Badge>
    );
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t("copyWorkflow.providerSettings.title")}</DrawerHeader>
        <DrawerBody>
          <Stack spacing={8}>
            {DOMAIN_ORDER.map((domain) => {
              const summary = overview[domain];
              const activeSelection = domain === "text" ? textSelection : imageSelection;
              const activeLabel =
                summary.providers.find((provider) => provider.name === summary.active)?.label ??
                summary.active;

              return (
                <Stack key={domain} spacing={4}>
                  <Stack spacing={1}>
                    <Text fontWeight="semibold">{t(`features:${DOMAIN_KEYS[domain]}`)}</Text>
                    <Text fontSize="sm" color="subtle">
                      {t("copyWorkflow.providerSettings.activeLabel", { provider: activeLabel })}
                    </Text>
                  </Stack>
                  <RadioGroup
                    value={activeSelection}
                    onChange={(value) =>
                      domain === "text" ? setTextSelection(value) : setImageSelection(value)
                    }
                  >
                    <Stack spacing={3}>
                      {summary.providers.map((provider) => (
                        <Stack
                          key={provider.name}
                          spacing={2}
                          borderRadius="xl"
                          border="1px solid"
                          borderColor={provider.name === activeSelection ? "brand.200" : "ink.100"}
                          p={4}
                        >
                          <Stack direction="row" justify="space-between" align="center">
                            <Radio value={provider.name}>{provider.label}</Radio>
                            {renderProviderBadge(provider)}
                          </Stack>
                          <Stack spacing={1} fontSize="sm" color="subtle">
                            <Text>
                              {t("copyWorkflow.providerSettings.driver", { driver: provider.driver })}
                            </Text>
                            {provider.missingCredentials.length > 0 ? (
                              <Text>
                                {t("copyWorkflow.providerSettings.missing", {
                                  credentials: provider.missingCredentials.join(", "),
                                })}
                              </Text>
                            ) : null}
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Stack>
              );
            })}
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Stack direction="row" spacing={3}>
            <Button variant="ghost" onClick={onClose}>
              {t("common:buttons.cancel")}
            </Button>
            <Button onClick={handleSave} isLoading={isSubmitting} isDisabled={saveDisabled || isSubmitting}>
              {t("copyWorkflow.providerSettings.actions.save")}
            </Button>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
