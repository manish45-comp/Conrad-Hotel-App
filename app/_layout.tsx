import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider, useTheme } from "react-native-paper";
import splashAnim from "../assets/animations/splash.json";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTheme } from "../theme";

// ---------- Component ----------

export default function RootLayout(): React.JSX.Element {
  // ---------- Load Fonts ----------
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const theme = useTheme();
  const [splashDone, setSplashDone] = React.useState(false);

  React.useEffect(() => {
    NavigationBar.setButtonStyleAsync("light");
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const showSplash = !fontsLoaded || !splashDone;

  const insets = useSafeAreaInsets();

  // ---------- Loading Fallback ----------
  if (showSplash) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <LottieView
          source={splashAnim}
          autoPlay
          loop
          resizeMode="cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  }

  // ---------- Main Layout ----------
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={lightTheme}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#1A1A1A",
            paddingBottom: insets.bottom,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          />
          <StatusBar barStyle="light-content" />
        </View>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
