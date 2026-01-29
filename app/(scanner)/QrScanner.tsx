import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { Button, Surface, Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const QrScanner = () => {
  const [facing] = useState<CameraType>("back");
  const [permissions, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(true);
  const insets = useSafeAreaInsets();

  // Animation for the scanning line
  const scanLineAnim = new Animated.Value(0);

  useEffect(() => {
    const startAnimation = () => {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };
    startAnimation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScannerVisible(true);
      return () => setScannerVisible(false);
    }, []),
  );

  const handleScan = (scanningResult: BarcodeScanningResult) => {
    if (!scannerVisible) return;
    const visitorId = scanningResult?.data?.trim();
    if (!visitorId) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScannerVisible(false);

    router.push({
      pathname: "/(scanner)/VisitorQrDetails" as any,
      params: { id: visitorId },
    });
  };

  if (!permissions) return <View style={styles.container} />;

  if (!permissions.granted) {
    return (
      <View style={styles.permissionDenied}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#C5A059" />
        <Text style={styles.permissionText}>SECURE CAMERA ACCESS REQUIRED</Text>
        <Button
          mode="contained"
          onPress={requestPermission}
          style={styles.goldButton}
          labelStyle={styles.goldButtonLabel}
        >
          GRANT ACCESS
        </Button>
      </View>
    );
  }

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        facing={facing}
        style={styles.fullScreenCamera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scannerVisible ? handleScan : undefined}
      >
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.overlayTop}>
            <Text style={styles.scanHeader}>SECURITY SCAN</Text>
          </View>
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.scannerWindow}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Animated Scan Line */}
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY }] }]}
              />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>

        <Surface
          style={[styles.instructionBox, { bottom: insets.bottom + 40 }]}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={20}
            color="#C5A059"
          />
          <Text style={styles.instructionText}>
            CENTER QR CODE WITHIN FRAME
          </Text>
        </Surface>
      </CameraView>
    </SafeAreaView>
  );
};

const SCANNER_SIZE = 280;
const OVERLAY_COLOR = "rgba(10, 10, 10, 0.8)";
const GOLD = "#C5A059";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  permissionDenied: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#1A1A1A",
  },
  permissionText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
    letterSpacing: 2,
    fontSize: 12,
    opacity: 0.7,
  },
  goldButton: { backgroundColor: GOLD, borderRadius: 0, width: "100%" },
  goldButtonLabel: { color: "#1A1A1A", fontWeight: "700" },
  fullScreenCamera: { flex: 1 },
  overlayTop: {
    flex: 1,
    backgroundColor: OVERLAY_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  scanHeader: {
    color: GOLD,
    letterSpacing: 4,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 40,
  },
  overlayMiddle: { flexDirection: "row", height: SCANNER_SIZE },
  overlaySide: { flex: 1, backgroundColor: OVERLAY_COLOR },
  scannerWindow: {
    height: SCANNER_SIZE,
    width: SCANNER_SIZE,
    backgroundColor: "transparent",
  },
  overlayBottom: { flex: 1.5, backgroundColor: OVERLAY_COLOR },
  scanLine: {
    height: 2,
    width: "100%",
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  corner: {
    position: "absolute",
    borderColor: GOLD,
    width: 30,
    height: 30,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  instructionBox: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "rgba(38, 38, 38, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.3)",
  },
  instructionText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});

export default QrScanner;
