import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { ActivityIndicator, Icon, Text, useTheme } from "react-native-paper";

interface Props {
  icon: string;
  bg: string;
  color: string;
  title: string;
  size?: number;
  loading: boolean;
  onPress?: () => void;
}

export default function ActionIconButton({
  icon,
  bg,
  color,
  title,
  loading,
  size = 20,
  onPress,
}: Props) {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      speed: 20,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={() => animatePress(0.85)}
      onPressOut={() => animatePress(1)}
      onPress={onPress}
      android_ripple={{ color: theme.colors.outlineVariant }}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ scale }],
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <>
            <Icon source={icon} size={size} color={color} />
            <Text style={{ color: color }} variant="labelLarge">
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    width: 130,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    overflow: "hidden",
  },
});
