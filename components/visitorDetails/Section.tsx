import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Icon, Text } from "react-native-paper";

interface SectionProps {
  icon: string;
  label: string;
  value?: string | null;
  style?: StyleProp<ViewStyle>;
}

const GOLD = "#C5A059";

const Section: React.FC<SectionProps> = ({ icon, label, value, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon with a subtle gold halo */}
      <View style={styles.iconWrapper}>
        <Icon source={icon} size={18} color={GOLD} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.label}>{label?.toUpperCase()}</Text>
        <Text style={styles.value} numberOfLines={2}>
          {value || "Not Specified"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(197, 160, 89, 0.1)", // Very faint gold divider
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(197, 160, 89, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "#9CA3AF",
    letterSpacing: 1.5,
    fontWeight: "700",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default Section;
