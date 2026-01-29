import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { MD3Theme, TextInput } from "react-native-paper";

interface AppTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: MD3Theme;
  required?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  placeholder?: string;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  value,
  onChangeText,
  theme,
  required = false,
  keyboardType = "default",
  multiline = false,
  style,
  inputStyle,
  disabled = false,
  placeholder,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Label Above Input */}
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: "Inter_500Medium",
          },
        ]}
      >
        {label}
        {required && (
          <Text style={{ color: theme.colors.error, fontSize: 14 }}> *</Text>
        )}
      </Text>

      <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        dense
        keyboardType={keyboardType}
        multiline={multiline}
        disabled={disabled}
        placeholder={placeholder ?? label}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        style={{
          backgroundColor: disabled
            ? theme.colors.surfaceDisabled
            : theme.colors.surfaceContainerLow,
        }}
        outlineStyle={{
          borderRadius: 10,
        }}
        contentStyle={[
          styles.inputContent,
          { fontFamily: "Inter_400Regular" },
          multiline && { paddingTop: 14 },
          inputStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputContent: {
    fontSize: 16,
    paddingHorizontal: 12,
  },
});

export default AppTextInput;
