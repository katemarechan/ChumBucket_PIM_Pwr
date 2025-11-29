import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

// constants/theme.ts
export const Colors = {
  light: {
    text: "#2a2a2a",
    textSecondary: "#666",
    background: "#f5f5dc",
    backgroundGradient: "#fff8dc",
    cardBg: "rgba(255,255,255,0.4)",
    cardBorder: "rgba(255,255,255,0.3)",
    inputBg: "rgba(255,255,255,0.4)",
    divider: "rgba(0,0,0,0.05)",
    navBg: "rgba(255,255,255,0.95)",
    primary: "#8fbc8f",
    tint: "#8fbc8f",
    icon: "#687076",
  },
  dark: {
    text: "#fff",
    textSecondary: "#999",
    background: "#2a2a2a",
    backgroundGradient: "#1a1a1a",
    cardBg: "rgba(0,0,0,0.2)",
    cardBorder: "rgba(255,255,255,0.1)",
    inputBg: "rgba(255,255,255,0.1)",
    divider: "rgba(255,255,255,0.05)",
    navBg: "rgba(0,0,0,0.95)",
    primary: "#8b4789",
    tint: "#8b4789",
    icon: "#9BA1A6",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
