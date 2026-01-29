import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

interface ConfirmDialogProps {
  visible: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isApproveLoading: boolean;
  isRejectLoading: boolean;
}

export default function ConfirmDialog({
  visible,
  message,
  confirmText = "Confirm",
  cancelText = "Back",
  onConfirm,
  onCancel,
  isApproveLoading,
  isRejectLoading,
}: ConfirmDialogProps) {
  const theme = useTheme();

  useEffect(() => {
    if (!visible) return;
    const handler = () => {
      onCancel();
      return true;
    };
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handler,
    );
    return () => subscription.remove();
  }, [visible, onCancel]);

  const isLoading = isApproveLoading || isRejectLoading;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: theme.colors.surfaceContainerHighest,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="labelLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            VERIFICATION
          </Text>
        </View>

        <Text style={[styles.message, { color: theme.colors.onSurface }]}>
          {message}
        </Text>

        <View style={styles.actions}>
          <Button
            mode="text"
            onPress={onCancel}
            textColor={theme.colors.onSurfaceVariant}
            labelStyle={styles.buttonLabel}
            style={styles.flexButton}
          >
            {cancelText}
          </Button>

          <Button
            loading={isLoading}
            disabled={isLoading}
            mode="contained"
            onPress={onConfirm}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            labelStyle={[styles.buttonLabel, { fontWeight: "bold" }]}
            style={styles.flexButton}
            contentStyle={styles.buttonContent}
          >
            {confirmText}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 20, // Slightly smaller radius for a tighter look
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    letterSpacing: 2,
    fontWeight: "700",
  },
  message: {
    fontSize: 15, // Reduced from 18
    lineHeight: 22,
    textAlign: "left", // Left align is more compact and efficient to read
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    justifyContent: "flex-end",
  },
  flexButton: {
    borderRadius: 8,
    minWidth: 100,
  },
  buttonContent: {
    height: 40, // Shorter buttons for compactness
  },
  buttonLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
