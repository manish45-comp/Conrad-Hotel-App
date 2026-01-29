import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const GOLD = "#C5A059";
const DARK_BG = "#1A1A1A";

export default function GatepassCard({ gp, gatepassStatus }) {
  // We override the default system colors to maintain the 5-star theme
  // while keeping the logical 'intent' of the status (Green/Red/Amber)
  // hidden in subtle accent points.
  const isApproved = gatepassStatus === "Approve";
  const isRejected = gatepassStatus === "Reject";

  const getStatusAccent = () => {
    if (isApproved) return "#4ADE80"; // Emerald accent
    if (isRejected) return "#F87171"; // Rose accent
    return GOLD; // Gold for pending
  };

  return (
    <View style={styles.cardContainer}>
      {/* Decorative Left Border - The 'Premium' Stripe */}
      <View
        style={[styles.accentStripe, { backgroundColor: getStatusAccent() }]}
      />

      <View style={styles.content}>
        <View style={styles.textStack}>
          <Text style={styles.overheadLabel}>OFFICIAL CLEARANCE</Text>
          <Text style={styles.statusValue}>
            {gatepassStatus?.toUpperCase()}
          </Text>
        </View>

        {/* The "Seal of Authority" Icon */}
        <View
          style={[
            styles.sealWrapper,
            { borderColor: "rgba(197, 160, 89, 0.2)" },
          ]}
        >
          <Icon
            source={
              isApproved
                ? "shield-check"
                : isRejected
                  ? "shield-remove-outline"
                  : "clock-alert-outline"
            }
            size={24}
            color={GOLD}
          />
        </View>
      </View>

      {/* Subtle Background Textures */}
      <View style={styles.watermarkContainer}>
        <Icon source="crown" size={60} color="rgba(197, 160, 89, 0.03)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 80,
    backgroundColor: "#222", // Slightly lighter than the main background for depth
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.15)",
    position: "relative",
  },
  accentStripe: {
    width: 4,
    height: "100%",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 2,
  },
  textStack: {
    flex: 1,
  },
  overheadLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 2.5,
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "300", // Elegant thin font
    color: "#FFF",
    letterSpacing: 1,
  },
  sealWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  watermarkContainer: {
    position: "absolute",
    right: -10,
    bottom: -15,
    zIndex: 1,
  },
});
