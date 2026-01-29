import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  label: string;
  icon: string;
  active?: boolean;
  onPress: () => void;
  rightIcon?: string;
}

export default function DrawerMenuItem({
  label,
  icon,
  active = false,
  onPress,
  rightIcon,
}: Props) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.container,
          active && { backgroundColor: "rgba(197, 160, 89, 0.08)" }, // Very subtle gold wash
          pressed && { opacity: 0.8 },
        ]}
      >
        {/* Left Accent Bar for Active State */}
        {active && (
          <View
            style={[
              styles.activeBar,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}

        <View style={styles.content}>
          <MaterialCommunityIcons
            name={icon as any}
            size={22}
            color={
              active ? theme.colors.primary : theme.colors.onSurfaceVariant
            }
          />

          <Text
            variant="bodyLarge"
            style={[
              styles.label,
              {
                color: active
                  ? theme.colors.onSurface
                  : theme.colors.onSurfaceVariant,
                fontWeight: active ? "700" : "500",
                letterSpacing: active ? 0.3 : 0,
              },
            ]}
          >
            {label}
          </Text>

          {rightIcon ? (
            <MaterialCommunityIcons
              name={rightIcon as any}
              size={18}
              color={active ? theme.colors.primary : theme.colors.outline}
            />
          ) : active ? (
            <View
              style={[styles.dot, { backgroundColor: theme.colors.primary }]}
            />
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 12,
    overflow: "hidden",
    height: 56,
    justifyContent: "center",
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "25%",
    bottom: "25%",
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: 15,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
