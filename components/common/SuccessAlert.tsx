import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

interface Props {
  visible: boolean;
  message: string;
  icon?: string;
  duration?: number;
  onDismiss: () => void;
}

export default function SuccessAlert({
  visible,
  message,
  icon = "check-circle-outline",
  duration = 1600,
  onDismiss,
}: Props) {
  const theme = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => onDismiss(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.alertBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            backgroundColor: "#1A1A1A", // charcoal
            borderColor: "#C5A059", // gold edge
          },
        ]}
      >
        <View style={styles.iconRing}>
          <Icon source={icon} size={26} color="#C5A059" />
        </View>

        <Text variant="titleMedium" style={styles.message}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 9999,
  },

  alertBox: {
    width: 270,
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },

  iconRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(197,160,89,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  message: {
    marginTop: 4,
    color: "#F5E7C3",
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
