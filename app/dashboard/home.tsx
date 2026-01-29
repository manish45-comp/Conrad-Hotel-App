import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

type GradientColors = readonly [string, string];

// Luxury-specific gradients using your theme's gold and surface tones
const GRADIENTS: Record<string, GradientColors> = {
  gold: ["#383838", "#2A2416"], // Dark to deep gold-tint
  slate: ["#2E2E2E", "#1C1C1C"], // Subtle depth for secondary items
  accent: ["#C5A059", "#B89A54"], // Solid Gold for high priority
};

const HotelDashboard = () => {
  const theme = useTheme();

  const Card = ({
    title,
    subtitle,
    icon,
    onPress,
    isPrimary = false,
  }: {
    title: string;
    subtitle: string;
    icon: any;
    onPress: () => void;
    isPrimary?: boolean;
  }) => {
    const gradientColors = isPrimary ? GRADIENTS.gold : GRADIENTS.slate;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.cardWrapper}
      >
        <Surface style={styles.surface} elevation={2}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.contentRow}>
              {/* Icon Container with subtle border for luxury feel */}
              <View
                style={[
                  styles.iconContainer,
                  { borderColor: theme.colors.outline },
                ]}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={28}
                  color={
                    isPrimary
                      ? theme.colors.primary
                      : theme.colors.onSurfaceVariant
                  }
                />
              </View>

              <View style={styles.textContainer}>
                <Text
                  variant="titleMedium"
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  {title}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.cardSubtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {subtitle}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.colors.primary}
              />
            </View>
          </LinearGradient>
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.grid}>
        <Card
          title="Guest Arrivals"
          subtitle="Manage VIP & Visitor check-ins"
          icon="account-star-outline"
          isPrimary={true}
          onPress={() => router.navigate("/dashboard/visitor-list")}
        />
      </View>
    </ScrollView>
  );
};

export default HotelDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  overline: {
    letterSpacing: 3,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerTitle: {
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  grid: {
    marginTop: 16,
    gap: 16,
  },
  cardWrapper: {
    width: "100%",
  },
  surface: {
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    padding: 24,
    minHeight: 90,
    justifyContent: "center",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    marginTop: 2,
    opacity: 0.7,
  },
});
