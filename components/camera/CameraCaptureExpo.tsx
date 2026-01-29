import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const GOLD = "#C5A059";

interface Props {
  onCapture: (base64: string) => void;
}

export default function CameraCapture({ onCapture }: Props) {
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Camera access is required to capture a profile photo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]?.base64) return;

    onCapture(result.assets[0].base64);
  };

  return (
    <Button
      mode="contained"
      icon="camera-plus-outline"
      onPress={openCamera}
      style={[styles.actionButton, styles.checkoutButton]}
      contentStyle={styles.buttonContent}
      labelStyle={styles.actionButtonLabel}
    >
      Add Photo
    </Button>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutButton: {
    backgroundColor: "#2A2A2A", // Dark luxury checkout button
    borderWidth: 1,
    borderColor: GOLD,
  },
  actionButtonLabel: {
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#fff",
  },
  buttonContent: { height: 58 },
});
