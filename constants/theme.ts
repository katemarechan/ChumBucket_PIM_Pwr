import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#2a2a2a",
    textSecondary: "#666",
    background: "#FFFEFC",
    backgroundGradient: "#FFFEFB",
    cardBg: "rgba(246,244,244,0.85)",
    cardBorder: "#E0E0E0",
    inputBg: "rgba(250,241,241,0.6)",
    divider: "rgba(0,0,0,0.05)",
    navBg: "rgba(230,230,230,0.95)",
    primary: "#C1B2E3",
    primaryButton: "#C1B2E3",
    tint: "#C1B2E3",
    icon: "#687076",
  },
  dark: {
    text: "#fff",
    textSecondary: "#999",
    background: "#2a2a2a",
    backgroundGradient: "#1a1a1a",
    cardBg: "#393939",
    cardBorder: "#3a3a3a",
    inputBg: "rgba(255,255,255,0.1)",
    divider: "rgba(255,255,255,0.05)",
    navBg: "rgba(39,38,38,0.95)",
    primaryButton: "#8b4789",
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
