import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  step: number;
  total: number;
  title: string;
};

export function StepIndicator({ step, total, title }: Props) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.leftGroup}>
          {router.canGoBack() && (
            <Pressable
              onPress={handleBack}
              hitSlop={10}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={22}
                color="#FFF"
              />
            </Pressable>
          )}

          <Text style={styles.stepText}>
            PHASE {step} / {total}
          </Text>
        </View>

        <Text style={styles.titleText}>{title.toUpperCase()}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(step / total, 1) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backButton: {
    padding: 2,
    marginRight: 2,
  },

  stepText: {
    color: "#C5A059",
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "700",
  },

  titleText: {
    color: "#FFF",
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.6,
  },

  track: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#C5A059",
  },
});
