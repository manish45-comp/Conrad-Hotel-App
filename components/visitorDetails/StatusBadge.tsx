import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "./styles";

export default function StatusBadge({ bg, text, label }) {
  return (
    <View style={styles.statusBadgeWrapper}>
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={{ color: text, fontWeight: "600" }}>{label}</Text>
      </View>
    </View>
  );
}
