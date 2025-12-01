import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";

import { AppIcon } from "@/components/icons";
import {
  CampaignsPage,
  DashboardPage,
  InsightsPage,
  SettingsPage,
} from "@/routes";

const navigationItems = [
  { key: "dashboard", to: "/", icon: "dashboard" as const },
  { key: "campaigns", to: "/campaigns", icon: "campaigns" as const },
  { key: "insights", to: "/insights", icon: "insights" as const },
  { key: "settings", to: "/settings", icon: "settings" as const },
];

const App = () => {
  const { t } = useTranslation("common");

  return (
    <Flex direction="column" minH="100vh" bg="canvas">
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex="banner"
        borderBottom="1px solid"
        borderColor="border-subtle"
        bg="surface"
        backdropFilter="blur(6px)"
      >
        <Container maxW="6xl" py={{ base: 4, md: 5 }}>
          <Flex align="center" justify="space-between" gap={6}>
            <HStack spacing={3}>
              <Flex
                align="center"
                justify="center"
                boxSize={10}
                borderRadius="xl"
                bg="brand.500"
                color="white"
                shadow="floating"
              >
                <AppIcon name="sparkles" boxSize={5} />
              </Flex>
              <Stack spacing={0}>
                <Text fontWeight="semibold">{t("app.name")}</Text>
                <Text fontSize="sm" color="subtle">
                  {t("app.tagline")}
                </Text>
              </Stack>
            </HStack>

            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              {navigationItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<AppIcon name={item.icon} boxSize={4} />}
                      borderRadius="pill"
                      color={isActive ? "brand.600" : "subtle"}
                      bg={isActive ? "brand.50" : "transparent"}
                      _hover={{ bg: "brand.50", color: "brand.600" }}
                    >
                      {t(`navigation.${item.key}`)}
                    </Button>
                  )}
                </NavLink>
              ))}
            </HStack>

            <HStack spacing={3}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<AppIcon name="menu" boxSize={5} />}
                  aria-label={t("aria.openNavigation")}
                  display={{ base: "inline-flex", md: "none" }}
                  variant="ghost"
                  borderRadius="pill"
                />
                <MenuList>
                  {navigationItems.map((item) => (
                    <MenuItem key={item.to} as={NavLink} to={item.to} end={item.to === "/"}>
                      <HStack spacing={3}>
                        <AppIcon name={item.icon} boxSize={4} />
                        <Text>{t(`navigation.${item.key}`)}</Text>
                      </HStack>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<AppIcon name="plus" boxSize={4} />}
                display={{ base: "none", md: "inline-flex" }}
              >
                {t("buttons.newBrief")}
              </Button>
              <Avatar name="Avery Lee" size="sm" bg="brand.500" color="white" />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main" flex="1" py={{ base: 6, md: 10 }}>
        <Container maxW="6xl">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
    </Flex>
  );
};

export default App;
