import {
  ROUTE_ICONS,
  ROUTE_TITLES,
  RouteKey,
  ROUTES,
} from "@/constants/dashboardRoutes";
import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DrawerFooter from "./DrawerFooter";
import DrawerHeader from "./DrawerHeader";
import DrawerMenuItem from "./DrawerMenuItem";

interface Props {
  active: RouteKey;
  onNavigate: (key: RouteKey, path: string) => void;
  onLogout: () => void;
}

export const toTitleCase = (text: string) =>
  text
    .split("-") // split "visitor-list"
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)) // Visitor List
    .join(" ");

export default function DrawerContent({ active, onNavigate, onLogout }: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      <DrawerHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {Object.entries(ROUTES).map(([key, path]) => {
          const routeKey = key as RouteKey;
          return (
            <DrawerMenuItem
              key={routeKey}
              label={ROUTE_TITLES[routeKey]} // 👈 Correct title
              icon={ROUTE_ICONS[routeKey]} // 👈 Correct icon
              active={active === routeKey}
              onPress={() => onNavigate(routeKey, path)}
            />
          );
        })}
      </ScrollView>
      <DrawerFooter onLogout={onLogout} />
    </SafeAreaView>
  );
}
