import React from "react";
import { StyleSheet } from "react-native";
import { Drawer, useTheme } from "react-native-paper";

interface DrawerButtonProps {
  label: string;
  icon: string;
  isActive?: boolean;
  onPress: () => void;
}

const DrawerButton: React.FC<DrawerButtonProps> = ({
  label,
  icon,
  isActive = false,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Drawer.Item
      label={label}
      icon={icon}
      onPress={onPress}
      active={isActive}
      style={[styles.item]}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 0,
  },
});

export default DrawerButton;
