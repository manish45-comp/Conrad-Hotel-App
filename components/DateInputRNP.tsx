import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export default function DateRangePickerRNP({
  onChange,
  value,
}: {
  onChange?: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  value: {
    startDate?: Date;
    endDate?: Date;
  };
}) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const [range, setRange] = useState({
    startDate: value?.startDate,
    endDate: value?.endDate,
  });

  useEffect(() => {
    setRange({
      startDate: value?.startDate,
      endDate: value?.endDate,
    });
  }, [value]);

  const onDismiss = () => setVisible(false);

  const onConfirm = ({
    startDate,
    endDate,
  }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => {
    setVisible(false);
    setRange({ startDate, endDate });
    onChange?.({ startDate, endDate });
  };

  const formatDate = (date?: Date) =>
    date ? date.toLocaleDateString() : "Select date";

  return (
    <View style={{ paddingVertical: 8 }}>
      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        style={{ borderColor: theme.colors.outline }}
      >
        {range.startDate && range.endDate
          ? `${formatDate(range.startDate)} → ${formatDate(range.endDate)}`
          : "Select Date Range"}
      </Button>

      <DatePickerModal
        locale="en"
        mode="range"
        visible={visible}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
        validRange={{
          startDate: new Date(2020, 0, 1),
          endDate: new Date(),
        }}
      />

      {range.startDate && range.endDate && (
        <Text
          style={{
            marginTop: 8,
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
            fontFamily: "Inter_500Medium",
          }}
        >
          Showing Records From {formatDate(range.startDate)} to{" "}
          {formatDate(range.endDate)}
        </Text>
      )}
    </View>
  );
}
