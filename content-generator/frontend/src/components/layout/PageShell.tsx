import { Box, Flex, Heading, HStack, Stack, StackProps, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

import { useIsMobile } from "@/hooks";

type PageShellProps = StackProps & {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

export const PageShell = ({
  title,
  subtitle,
  actions,
  toolbar,
  children,
  ...stackProps
}: PageShellProps) => {
  const isMobile = useIsMobile();

  return (
    <Stack spacing={{ base: 8, md: 10 }} {...stackProps}>
      <Stack spacing={{ base: 4, md: 5 }}>
        <Flex
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={{ base: 4, md: 6 }}
        >
          <Stack spacing={{ base: 2, md: 3 }}>
            <Heading size={{ base: "lg", md: "xl" }}>{title}</Heading>
            {subtitle ? (
              <Text color="subtle" maxW="3xl">
                {subtitle}
              </Text>
            ) : null}
          </Stack>
          {actions ? (
            <HStack
              spacing={{ base: 2, md: 3 }}
              flexWrap="wrap"
              justify={isMobile ? "flex-start" : "flex-end"}
            >
              {actions}
            </HStack>
          ) : null}
        </Flex>
        {toolbar ? <Box>{toolbar}</Box> : null}
      </Stack>
      <Stack spacing={{ base: 6, md: 8 }}>{children}</Stack>
    </Stack>
  );
};
