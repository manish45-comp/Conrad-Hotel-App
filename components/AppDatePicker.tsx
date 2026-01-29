import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

interface AppDatePickerProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
  inputMode?: "start" | "end";
  style?: object;
}

const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  inputMode = "start",
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* <Text
        style={[
          styles.label,
          { color: theme.colors.secondary, fontFamily: "Inter_500Medium" },
        ]}
      >
        {label}
        {required && <Text style={{ color: theme.colors.error }}> *</Text>}
      </Text> */}

      <DatePickerInput
        locale="en"
        value={value}
        onChange={onChange}
        inputMode={inputMode}
        mode="outlined"
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        theme={{
          colors: {
            primary: theme.colors.primary,
            text: theme.colors.onSurface,
            placeholder: theme.colors.secondary,
            background: theme.colors.onSecondary,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
  },
  input: {
    borderRadius: 10,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

export default AppDatePicker;
