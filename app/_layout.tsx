import { RecipesProvider } from "@/context/RecipesContext";
import { ThemeProvider, useThemeManager } from "@/context/ThemeContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

function LayoutInner() {
  const { current } = useThemeManager();

  return (
    <NavThemeProvider value={current === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={current === "dark" ? "light" : "dark"} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RecipesProvider>
        <LayoutInner />
      </RecipesProvider>
    </ThemeProvider>
  );
}
