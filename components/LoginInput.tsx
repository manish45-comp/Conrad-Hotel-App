import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

interface LoginInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "visible-password";
  icon?: string;
}

export const LoginInput: React.FC<LoginInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  icon,
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = secureTextEntry === true;

  return (
    <View style={{ marginBottom: 14 }}>
      <TextInput
        mode="outlined"
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordField && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        placeholderTextColor={theme.colors.secondary}
        outlineStyle={{
          borderRadius: 10,
          backgroundColor: theme.colors.surfaceContainer,
        }}
        contentStyle={{
          paddingHorizontal: 16,
          fontSize: 16,
          fontFamily: "Inter_500Medium",
        }}
        style={{ height: 56 }}
        right={
          isPasswordField ? (
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
              forceTextInputFocus={false}
            />
          ) : icon ? (
            <TextInput.Icon icon={icon} />
          ) : null
        }
      />
    </View>
  );
};
