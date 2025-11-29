import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export type AppTheme = "light" | "dark";

type ThemeContextType = {
  theme: AppTheme;
  current: AppTheme;
  changeTheme: (newTheme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const system = Appearance.getColorScheme();
    return system === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    AsyncStorage.getItem("app_theme").then((saved) => {
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    });
  }, []);

  const changeTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    AsyncStorage.setItem("app_theme", newTheme);
  };

  const current = theme;

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
