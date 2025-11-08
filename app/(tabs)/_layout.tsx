import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { RecipesProvider } from "@/context/RecipesContext";
import { useThemeManager } from "@/context/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const { current } = useThemeManager();
  const themeColors = Colors[current];

  return (
    <RecipesProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 25,
            backgroundColor: themeColors.background,
            borderTopWidth: 0,
            elevation: 4,
            height: 65,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 10,
          },
        }}
      >
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ focused }) => (
              <AntDesign
                size={24}
                name="plus"
                color={focused ? themeColors.tint : themeColors.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="homefeed"
          options={{
            tabBarIcon: ({ focused }) => (
              <Entypo
                size={24}
                name="home"
                color={focused ? themeColors.tint : themeColors.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <AntDesign
                size={24}
                name="user"
                color={focused ? themeColors.tint : themeColors.icon}
              />
            ),
          }}
        />
      </Tabs>
    </RecipesProvider>
  );
}
