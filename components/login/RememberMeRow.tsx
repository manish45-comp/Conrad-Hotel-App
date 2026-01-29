import React from "react";
import { View } from "react-native";
import { Checkbox, Text, useTheme } from "react-native-paper";

interface RememberMeProps {
  checked: boolean;
  onToggle: () => void;
  textColor: any;
}

export const RememberMeRow: React.FC<RememberMeProps> = ({
  checked,
  onToggle,
  textColor,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={onToggle}
        color={theme.colors.primary}
      />
      <Text style={[textColor, { fontFamily: "Inter_400Regular" }]}>
        Remember Me
      </Text>
    </View>
  );
};
