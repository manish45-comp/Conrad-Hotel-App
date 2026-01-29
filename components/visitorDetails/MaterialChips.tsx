import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";

const GOLD = "#C5A059";

export default function MaterialChips({ field, materialOptions }) {
  return (
    <View style={styles.container}>
      <Text style={styles.overheadLabel}>DEPOSITED PROPERTY</Text>

      <View style={styles.chipGrid}>
        {materialOptions.map((item) => {
          const isSelected = field.value.includes(item.label);

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              onPress={() => {
                const updated = isSelected
                  ? field.value.filter((v) => v !== item.label)
                  : [...field.value, item.label];

                field.onChange(updated);
              }}
              style={[styles.luxuryTag, isSelected && styles.luxuryTagSelected]}
            >
              <Icon
                source={item.icon}
                size={16}
                color={isSelected ? "#121212" : GOLD}
              />
              <Text
                style={[styles.tagLabel, isSelected && styles.tagLabelSelected]}
              >
                {item.label?.toUpperCase()}
              </Text>

              {isSelected && (
                <View style={styles.checkIndicator}>
                  <Icon source="check" size={10} color="#121212" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  overheadLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  luxuryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 4,
  },
  luxuryTagSelected: {
    backgroundColor: GOLD,
    borderColor: GOLD,
  },
  tagLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: GOLD,
    marginLeft: 8,
    letterSpacing: 1,
  },
  tagLabelSelected: {
    color: "#121212",
    fontWeight: "800",
  },
  checkIndicator: {
    marginLeft: 6,
    backgroundColor: "rgba(18, 18, 18, 0.1)",
    borderRadius: 10,
    padding: 2,
  },
});
