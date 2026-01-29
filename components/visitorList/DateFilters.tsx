import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  fromDate: Date;
  toDate: Date;
  showFrom: boolean;
  showTo: boolean;
  setShowFrom: (v: boolean) => void;
  setShowTo: (v: boolean) => void;
  setFromDate: (d: Date) => void;
  setToDate: (d: Date) => void;
}

const DateFilters: React.FC<Props> = ({
  fromDate,
  toDate,
  showFrom,
  showTo,
  setShowFrom,
  setShowTo,
  setFromDate,
  setToDate,
}) => {
  const theme = useTheme();

  const onChangeFrom = (e: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== "ios") setShowFrom(false);
    if (date) setFromDate(date);
  };

  const onChangeTo = (e: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== "ios") setShowTo(false);
    if (date) setToDate(date);
  };

  // Simplified date formatter
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <View style={styles.container}>
      {/* From Date Segment */}
      <Pressable
        onPress={() => setShowFrom(true)}
        style={({ pressed }) => [
          styles.segment,
          {
            backgroundColor: pressed
              ? theme.colors.surfaceVariant
              : "transparent",
          },
        ]}
      >
        <Text
          variant="labelSmall"
          style={[styles.label, { color: theme.colors.primary }]}
        >
          FROM
        </Text>
        <Text
          variant="titleSmall"
          style={[styles.dateText, { color: theme.colors.onSurface }]}
        >
          {formatDate(fromDate)}
        </Text>
      </Pressable>

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />
      {/* To Date Segment */}
      <Pressable
        onPress={() => setShowTo(true)}
        style={({ pressed }) => [
          styles.segment,
          {
            backgroundColor: pressed
              ? theme.colors.surfaceVariant
              : "transparent",
          },
        ]}
      >
        <Text
          variant="labelSmall"
          style={[styles.label, { color: theme.colors.primary }]}
        >
          TO
        </Text>
        <Text
          variant="titleSmall"
          style={[styles.dateText, { color: theme.colors.onSurface }]}
        >
          {formatDate(toDate)}
        </Text>
      </Pressable>

      {showFrom && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChangeFrom}
        />
      )}

      {showTo && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={onChangeTo}
        />
      )}
    </View>
  );
};

export default DateFilters;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "flex-start", // Left aligned looks more "form-like" and premium
  },
  divider: {
    width: 1,
    height: 30,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5, // Increased spacing for luxury feel
    marginBottom: 4,
  },
  dateText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
