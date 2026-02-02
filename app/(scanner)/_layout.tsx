import { Stack } from "expo-router";
import React from "react";

const LUXURY_CHARCOAL = "#1A1A1A";
const LUXURY_GOLD = "#C5A059";

const ScannerLayout = () => {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: LUXURY_CHARCOAL,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(197, 160, 89, 0.2)",
        },
        headerTintColor: LUXURY_GOLD,
        headerTitleStyle: {
          fontSize: 14,
          fontFamily: "Inter_700Bold",
          letterSpacing: 2,
          textTransform: "uppercase",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: LUXURY_CHARCOAL,
        },
        cardStyle: { backgroundColor: LUXURY_CHARCOAL },
        detachPreviousScreen: false,
      }}
    >
      <Stack.Screen
        name="QrScanner"
        options={{
          title: "SECURE SCAN",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="VisitorQrDetails"
        options={{
          title: "GUEST PROFILE",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default ScannerLayout;
