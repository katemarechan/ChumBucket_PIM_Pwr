import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export type AppTheme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: AppTheme;
  current: "light" | "dark";
  changeTheme: (newTheme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<AppTheme>("system");
  const [current, setCurrent] = useState<"light" | "dark">(
    Appearance.getColorScheme() ?? "light"
  );

  useEffect(() => {
    AsyncStorage.getItem("app_theme").then((saved) => {
      if (saved) setTheme(saved as AppTheme);
    });
  }, []);

  useEffect(() => {
    const calc =
      theme === "system" ? Appearance.getColorScheme() ?? "light" : theme;
    setCurrent(calc);
  }, [theme]);

  const changeTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    AsyncStorage.setItem("app_theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, current, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeManager = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeManager must be used within ThemeProvider");
  return ctx;
};
