import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";

interface AppTimePickerProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
}

const AppTimePicker: React.FC<AppTimePickerProps> = ({
  label = "Select Time",
  value,
  onChange,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(value || "");

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const onConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      setSelectedTime(formattedTime);
      onChange(formattedTime);
    },
    [onChange]
  );

  return (
    <View style={[styles.container]}>
      {/* <Text
        style={[
          ,
          {
            fontSize: 14,
            color: theme.colors.secondary,
            fontFamily: "Inter_500Medium",
            marginBottom: 4,
          },
        ]}
      >
        {label}
        <Text style={{ color: theme.colors.error }}> *</Text>
      </Text> */}
      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        style={{
          borderRadius: 8,
          backgroundColor: theme.colors.surface,
          justifyContent: "flex-start",
        }}
      >
        {selectedTime || label}
      </Button>

      <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={0} // default value
        minutes={0} // default value
        label={label}
        cancelLabel="Cancel"
        confirmLabel="Ok"
        animationType="slide"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  timeText: {
    marginTop: 4,
    fontSize: 14,
  },
});

export default AppTimePicker;
