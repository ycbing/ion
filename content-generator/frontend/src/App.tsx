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
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { AppIcon } from "@/components/icons";
import {
  CampaignsPage,
  DashboardPage,
  InsightsPage,
  SettingsPage,
} from "@/routes";

const navigation = [
  { label: "Dashboard", to: "/", icon: "dashboard" as const },
  { label: "Campaigns", to: "/campaigns", icon: "campaigns" as const },
  { label: "Insights", to: "/insights", icon: "insights" as const },
  { label: "Settings", to: "/settings", icon: "settings" as const },
];

const App = () => {
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
                <Text fontWeight="semibold">Red Studio</Text>
                <Text fontSize="sm" color="subtle">
                  Creator workspace
                </Text>
              </Stack>
            </HStack>

            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              {navigation.map((item) => (
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
                      {item.label}
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
                  aria-label="Open navigation"
                  display={{ base: "inline-flex", md: "none" }}
                  variant="ghost"
                  borderRadius="pill"
                />
                <MenuList>
                  {navigation.map((item) => (
                    <MenuItem
                      key={item.to}
                      as={NavLink}
                      to={item.to}
                      end={item.to === "/"}
                    >
                      <HStack spacing={3}>
                        <AppIcon name={item.icon} boxSize={4} />
                        <Text>{item.label}</Text>
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
                New brief
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
