import { useEffect, useMemo, useState } from "react";
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

import type { ProviderDomain, ProviderOverview, ProviderSummary, UpdateActiveProvidersPayload } from "@/features/providers";

interface ProviderSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  overview: ProviderOverview;
  isSubmitting: boolean;
  onSave: (payload: UpdateActiveProvidersPayload) => Promise<void> | void;
}

const domainLabels: Record<ProviderDomain, string> = {
  text: "Text generation",
  image: "Image generation",
};

const domainOrder: ProviderDomain[] = ["text", "image"];

const hasChanges = (
  textSelection: string,
  imageSelection: string,
  overview: ProviderOverview,
): boolean =>
  textSelection !== overview.text.active || imageSelection !== overview.image.active;

const renderProviderBadge = (provider: ProviderSummary) => {
  if (provider.isActive) {
    return (
      <Badge colorScheme="brand" variant="solid">
        Active
      </Badge>
    );
  }

  if (provider.missingCredentials.length > 0) {
    return (
      <Badge colorScheme="red" variant="subtle">
        Credentials needed
      </Badge>
    );
  }

  return (
    <Badge colorScheme="green" variant="subtle">
      Ready
    </Badge>
  );
};

export const ProviderSettingsDrawer = ({
  isOpen,
  onClose,
  overview,
  isSubmitting,
  onSave,
}: ProviderSettingsDrawerProps) => {
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

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>AI provider settings</DrawerHeader>
        <DrawerBody>
          <Stack spacing={8}>
            {domainOrder.map((domain) => {
              const summary = overview[domain];
              const activeSelection = domain === "text" ? textSelection : imageSelection;

              return (
                <Stack key={domain} spacing={4}>
                  <Stack spacing={1}>
                    <Text fontWeight="semibold">{domainLabels[domain]}</Text>
                    <Text fontSize="sm" color="subtle">
                      Active: {summary.providers.find((provider) => provider.name === summary.active)?.label ?? summary.active}
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
                            <Text>Driver: {provider.driver}</Text>
                            {provider.missingCredentials.length > 0 ? (
                              <Text>
                                Missing: {provider.missingCredentials.map((credential) => credential).join(", ")}
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
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSubmitting} isDisabled={saveDisabled || isSubmitting}>
              Save providers
            </Button>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
