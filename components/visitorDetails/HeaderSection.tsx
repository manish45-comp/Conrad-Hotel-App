import { useVisitor } from "@/src/hooks/useVisitor";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ActivityIndicator, Surface, Text } from "react-native-paper";

interface Props {
  data: any;
  statusLabel?: string;
  isGatepassApproved: boolean;
}

const GOLD = "#C5A059";
const CHARCOAL = "#1A1A1A";

export default function HeaderSection({
  data,
  statusLabel,
  isGatepassApproved,
}: Props) {
  const name = data?.VisitorName;

  const image = data?.ImageUrl;
  const visiteeValue = data?.VisiteeName;

  const {profileUpdateLoading}=useVisitor()

  return (
    <View style={styles.container}>
      {/* Top Row: Portrait & Status */}
      <View style={styles.topRow}>
        <Surface style={styles.portraitFrame} elevation={4}>
          {!profileUpdateLoading ? image ? (
            <Image source={{ uri: image }} style={styles.portrait} />
          ) : (
            <View style={styles.initialsCircle}>
              <Text style={styles.initialsText}>{name?.charAt(0) || "?"}</Text>
            </View>
          ) :  <View style={styles.initialsCircle}>
            <ActivityIndicator size="small"/>
            </View>
            }
        </Surface>

        <View style={styles.mainInfo}>
          <Text style={styles.guestName} numberOfLines={2}>
            {name?.toUpperCase() || "VALUED GUEST"}
          </Text>
          <View style={styles.goldDivider} />

          {isGatepassApproved && (
            <View style={styles.luxuryBadge}>
              <View style={styles.pulsePoint} />
              <Text style={styles.statusText}>
                {statusLabel?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Row: Appointment Details */}
      {visiteeValue && (
        <View style={styles.detailsRow}>
          <Text style={styles.visiteeLabel}>MEETING WITH</Text>
          <Text style={styles.visiteeValue}>{visiteeValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  portraitFrame: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: GOLD,
    padding: 3,
    backgroundColor: CHARCOAL,
  },
  portrait: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  initialsCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "#262626",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: GOLD,
    fontSize: 32,
    fontWeight: "300",
  },
  mainInfo: {
    marginLeft: 20,
    flex: 1,
    justifyContent: "center",
  },
  guestName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 1,
    lineHeight: 24,
  },
  goldDivider: {
    width: 40,
    height: 2,
    backgroundColor: GOLD,
    marginVertical: 8,
  },
  luxuryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(197, 160, 89, 0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.3)",
  },
  pulsePoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
    marginRight: 8,
  },
  statusText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  detailsRow: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  visiteeLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  visiteeValue: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 2,
  },
});
