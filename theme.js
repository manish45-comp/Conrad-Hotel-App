import { MD3LightTheme } from "react-native-paper";

const makeTheme = (baseTheme, vars) => ({
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    ...vars,
  },
  fonts: {
    ...baseTheme.fonts,
    bodyLarge: { ...baseTheme.fonts.bodyLarge, fontFamily: "Inter_400Regular" },
    bodyMedium: {
      ...baseTheme.fonts.bodyMedium,
      fontFamily: "Inter_400Regular",
    },
    bodySmall: { ...baseTheme.fonts.bodySmall, fontFamily: "Inter_400Regular" },
    labelLarge: { ...baseTheme.fonts.labelLarge, fontFamily: "Inter_700Bold" },
    labelMedium: {
      ...baseTheme.fonts.labelMedium,
      fontFamily: "Inter_700Bold",
    },
    labelSmall: { ...baseTheme.fonts.labelSmall, fontFamily: "Inter_700Bold" },
    titleLarge: { ...baseTheme.fonts.titleLarge, fontFamily: "Inter_700Bold" },
    titleMedium: {
      ...baseTheme.fonts.titleMedium,
      fontFamily: "Inter_700Bold",
    },
    titleSmall: { ...baseTheme.fonts.titleSmall, fontFamily: "Inter_700Bold" },
  },
});

export const lightTheme = makeTheme(MD3LightTheme, {
  // === PRIMARY (Gold) ===
  primary: "#C5A059",
  surfaceTint: "#C5A059",
  onPrimary: "#1A1A1A",
  primaryContainer: "#2A2416",
  onPrimaryContainer: "#F5E7C3",
  inversePrimary: "#E6CF9A",
  primaryFixed: "#2A2416",
  onPrimaryFixed: "#F5E7C3",
  primaryFixedDim: "#B89A54",
  onPrimaryFixedVariant: "#EAD8A8",

  // === SECONDARY (Muted Slate) ===
  secondary: "#9CA3AF",
  onSecondary: "#1A1A1A",
  secondaryContainer: "#2A2A2A",
  onSecondaryContainer: "#E5E7EB",

  // === TERTIARY ===
  tertiary: "#6B7280",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#262626",
  onTertiaryContainer: "#F3F4F6",

  // === FEEDBACK ===
  error: "#DC2626",
  success: "#16A34A",

  successContainer: "#14532D",
  errorContainer: "#7F1D1D",

  onSuccess: "#FFFFFF",
  onError: "#FFFFFF",
  onErrorContainer: "#FFFFFF",

  // === SURFACES ===
  background: "#1A1A1A",
  onBackground: "#FFFFFF",

  surface: "#1F1F1F",
  onSurface: "#F9FAFB",

  surfaceVariant: "#262626",
  onSurfaceVariant: "#D1D5DB",

  outline: "#3F3F46",
  outlineVariant: "#52525B",

  shadow: "#000000",
  scrim: "#000000",

  inverseSurface: "#F3F4F6",
  inverseOnSurface: "#1A1A1A",

  // === FIXED SECONDARY ===
  secondaryFixed: "#2A2A2A",
  onSecondaryFixed: "#E5E7EB",
  secondaryFixedDim: "#404040",
  onSecondaryFixedVariant: "#D1D5DB",

  // === FIXED TERTIARY ===
  tertiaryFixed: "#262626",
  onTertiaryFixed: "#F3F4F6",
  tertiaryFixedDim: "#3F3F46",
  onTertiaryFixedVariant: "#D4D4D8",

  // === SURFACE LEVELS ===
  surfaceDim: "#141414",
  surfaceBright: "#242424",

  surfaceContainerLowest: "#121212",
  surfaceContainerLow: "#1C1C1C",
  surfaceContainer: "#242424",
  surfaceContainerHigh: "#2E2E2E",
  surfaceContainerHighest: "#383838",

  // === ACCENT (same family as gold-primary) ===
  accent: "#C5A059",
  onAccent: "#1A1A1A",

  surfaceDisabled: "#2E2E2E",
  onSurfaceDisabled: "rgba(255,255,255,0.35)",

  backdrop: "rgba(0,0,0,0.6)",
  backdropLowes: "rgba(0,0,0,0.1)",
});
