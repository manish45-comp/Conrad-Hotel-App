import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { StepIndicator } from "@/components/common/StepIndicator";
import { useCameraCapture } from "@/src/hooks/useCameraCapture";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useBackButtonhandler } from "@/src/hooks/useBackButtonhandler";
import { CameraView } from "expo-camera";

const Capture = () => {
  const { showConfirm, setShowConfirm, onConfirmExit } = useBackButtonhandler();

  const theme = useTheme();
  const { setField, photoUrl } = useVisitorFormStore();
  const {
    photoUri,
    base64,
    capturePhoto,
    hasPhoto,
    isCameraActive,
    setIsCameraActive,
    cameraRef,
    permission,
    requestPermission,
  } = useCameraCapture();

  useEffect(() => {
    if (base64) setField("photoUrl", base64);
  }, [base64, setField]);

  const styles = React.useMemo(() => makeStyle(theme), [theme]);

  // Handle Permissions UI
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.pContainer}>
        <Button mode="contained" onPress={requestPermission}>
          Enable Camera
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StepIndicator step={2} total={5} title="Identity Portrait" />
      <ConfirmDialog
        visible={showConfirm}
        message="Are you want go back to home?"
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={onConfirmExit}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <View style={styles.body}>
        <View style={styles.content}>
          <Text style={styles.instructionText}>VISITOR PHOTOGRAPH</Text>

          <View style={styles.outerFrame}>
            <View style={styles.previewWrapper}>
              {isCameraActive ? (
                // SEAMLESS LIVE FEED
                <CameraView
                  ref={cameraRef}
                  facing="front"
                  mirror={true}
                  style={styles.image}
                />
              ) : photoUri || photoUrl ? (
                // PREVIEW OF TAKEN PHOTO
                <Image
                  source={{
                    uri: photoUri || `data:image/jpeg;base64,${photoUrl}`,
                  }}
                  style={styles.image}
                />
              ) : (
                // PLACEHOLDER
                <View style={styles.placeholder}>
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={48}
                    color="rgba(197, 160, 89, 0.2)"
                  />
                  <Text style={styles.placeholderText}>Awaiting Capture</Text>
                </View>
              )}
            </View>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={{ gap: 12 }}>
          {isCameraActive ? (
            <Button
              mode="contained"
              onPress={capturePhoto}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
            >
              SNAP PHOTO
            </Button>
          ) : (
            <Button
              mode="outlined"
              onPress={() => setIsCameraActive(true)}
              icon="camera"
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
            >
              {hasPhoto ? "RETAKE PORTRAIT" : "ACTIVATE CAMERA"}
            </Button>
          )}

          <Button
            mode="contained"
            disabled={(!hasPhoto && !photoUrl) || isCameraActive}
            onPress={() => router.push("/visitor-form/details")}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            CONTINUE
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Capture;

export const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    pContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
    },
    body: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      alignItems: "center",
      width: "100%",
    },
    instructionText: {
      color: theme.colors.primary,
      fontSize: 12,
      letterSpacing: 3,
      fontWeight: "700",
      marginBottom: 30,
    },
    outerFrame: {
      padding: 10,
      position: "relative",
    },
    previewWrapper: {
      width: 260,
      height: 260,
      borderRadius: 130, // Maintains the circular aesthetic
      overflow: "hidden",
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    placeholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      color: theme.colors.secondary,
      fontSize: 12,
      marginTop: 10,
      letterSpacing: 1,
    },
    hintText: {
      color: theme.colors.secondary,
      fontSize: 12,
      textAlign: "center",
      marginTop: 30,
      paddingHorizontal: 40,
      lineHeight: 18,
      opacity: 0.5,
    },
    // Corner Accents
    corner: {
      position: "absolute",
      width: 20,
      height: 20,
      borderColor: theme.colors.primary,
    },
    topLeft: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
    topRight: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 2,
      borderRightWidth: 2,
    },

    footer: {
      paddingBottom: 32,
    },
    primaryButton: {
      borderRadius: 0,
    },
    secondaryButton: {
      borderRadius: 0,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    primaryButtonLabel: {
      color: "#1A1A1A",
      fontWeight: "700",
      letterSpacing: 2,
    },
    buttonContent: {
      height: 56,
    },
  });
