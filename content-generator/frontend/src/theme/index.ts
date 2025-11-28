import { extendTheme } from "@chakra-ui/react";

const fonts = {
  heading:
    '"Plus Jakarta Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  body: '"Plus Jakarta Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const colors = {
  brand: {
    50: "#fff0f3",
    100: "#ffd9e1",
    200: "#ffb0c1",
    300: "#ff889f",
    400: "#ff5c7c",
    500: "#ff3b6b",
    600: "#e21f56",
    700: "#bc0f46",
    800: "#960935",
    900: "#6f0425",
  },
  ink: {
    50: "#f8fafc",
    100: "#eef2f6",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

const semanticTokens = {
  colors: {
    canvas: { default: "#fdf6f8", _dark: "#10141b" },
    surface: { default: "#ffffff", _dark: "#1c1f2a" },
    muted: { default: "ink.500", _dark: "ink.200" },
    subtle: { default: "ink.400", _dark: "ink.300" },
    "border-subtle": { default: "rgba(15, 23, 42, 0.08)", _dark: "rgba(255, 255, 255, 0.18)" },
    highlight: { default: "brand.50", _dark: "brand.800" },
  },
  radii: {
    card: "24px",
    pill: "999px",
  },
  shadows: {
    floating: "0 24px 48px -24px rgba(255, 59, 107, 0.28)",
  },
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: "pill",
      fontWeight: 600,
    },
    sizes: {
      sm: {
        h: 9,
        px: 4,
        fontSize: "sm",
      },
      md: {
        h: 11,
        px: 6,
        fontSize: "sm",
      },
    },
    variants: {
      primary: {
        bg: "brand.500",
        color: "white",
        shadow: "floating",
        _hover: { bg: "brand.600" },
        _active: { bg: "brand.700" },
      },
      soft: {
        bg: "highlight",
        color: "brand.600",
        _hover: { bg: "brand.100" },
        _active: { bg: "brand.200" },
      },
      outline: {
        borderColor: "brand.200",
        color: "brand.500",
        _hover: { bg: "brand.50", borderColor: "brand.400" },
      },
      ghost: {
        color: "subtle",
        _hover: { bg: "brand.50", color: "brand.600" },
      },
    },
    defaultProps: {
      variant: "primary",
      size: "md",
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: "pill",
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  Tag: {
    baseStyle: {
      borderRadius: "pill",
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: "xl",
      },
    },
    sizes: {
      md: {
        field: {
          h: 12,
          fontSize: "sm",
        },
      },
    },
    variants: {
      outline: {
        field: {
          borderColor: "ink.200",
          bg: "surface",
          _hover: { borderColor: "ink.300" },
          _focusVisible: {
            borderColor: "brand.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
          },
        },
      },
    },
    defaultProps: {
      size: "md",
      variant: "outline",
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: "xl",
    },
    sizes: {
      md: {
        fontSize: "sm",
      },
    },
    variants: {
      outline: {
        borderColor: "ink.200",
        bg: "surface",
        _hover: { borderColor: "ink.300" },
        _focusVisible: {
          borderColor: "brand.400",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
        },
      },
    },
    defaultProps: {
      size: "md",
      variant: "outline",
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: "xl",
      },
    },
    variants: {
      outline: {
        field: {
          borderColor: "ink.200",
          bg: "surface",
          _hover: { borderColor: "ink.300" },
          _focusVisible: {
            borderColor: "brand.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
          },
        },
      },
    },
    defaultProps: {
      variant: "outline",
    },
  },
};

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors,
  fonts,
  semanticTokens,
  components,
  styles: {
    global: {
      body: {
        bg: "canvas",
        color: "ink.800",
        fontFeatureSettings: '"ss03", "cv01"',
      },
    },
  },
});
