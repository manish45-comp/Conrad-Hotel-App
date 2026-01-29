import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  step: number;
  total: number;
  title: string;
};

export function StepIndicator({ step, total, title }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.stepText}>
          PHASE {step} / {total}
        </Text>
        <Text style={styles.titleText}>{title.toUpperCase()}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
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
  },
  fill: {
    height: "100%",
    backgroundColor: "#C5A059",
  },
});
