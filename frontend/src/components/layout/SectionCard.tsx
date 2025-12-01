import {
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

import { AppIcon, type AppIconName } from "@/components/icons";

type SectionCardProps = BoxProps & {
  title?: string;
  description?: string;
  icon?: AppIconName;
  actions?: ReactNode;
  children: ReactNode;
};

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ title, description, icon, actions, children, ...boxProps }, ref) => {
    const iconContainerBg = useColorModeValue("brand.50", "brand.900");

    return (
      <Box
        ref={ref}
        bg="surface"
        borderRadius="card"
        border="1px solid"
        borderColor="border-subtle"
        shadow="floating"
        p={{ base: 6, md: 7 }}
        _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
        transition="all 0.2s ease"
        {...boxProps}
      >
        <Stack spacing={{ base: 5, md: 6 }}>
          {(title || description || icon || actions) && (
            <Flex
              align={{ base: "flex-start", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 6 }}
              justify="space-between"
            >
              <HStack spacing={3} align="flex-start">
                {icon ? (
                  <Flex
                    align="center"
                    justify="center"
                    bg={iconContainerBg}
                    color="brand.600"
                    borderRadius="xl"
                    boxSize={10}
                  >
                    <AppIcon name={icon} boxSize={5} />
                  </Flex>
                ) : null}
                <Stack spacing={1}>
                  {title ? <Heading size="md">{title}</Heading> : null}
                  {description ? <Text color="subtle">{description}</Text> : null}
                </Stack>
              </HStack>
              {actions ? <Box>{actions}</Box> : null}
            </Flex>
          )}
          <Box>{children}</Box>
        </Stack>
      </Box>
    );
  },
);

SectionCard.displayName = "SectionCard";
