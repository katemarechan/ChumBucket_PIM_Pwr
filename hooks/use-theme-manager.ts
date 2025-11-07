import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";

export type AppTheme = "light" | "dark" | "system";

export function useThemeManager() {
  const [theme, setTheme] = useState<AppTheme>("system");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("app_theme");
      if (saved) setTheme(saved as AppTheme);
    })();
  }, []);

  const current =
    theme === "system" ? Appearance.getColorScheme() ?? "light" : theme;

  const changeTheme = async (value: AppTheme) => {
    setTheme(value);
    await AsyncStorage.setItem("app_theme", value);
  };

  return { theme, current, changeTheme };
}
