import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmDialog from "../common/ConfirmDialog";

interface Props {
  onLogout: () => void;
}

export default function DrawerFooter({ onLogout }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View
      style={[
        styles.footerContainer,
        {
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: Math.max(insets.bottom, 20),
          backgroundColor: theme.colors.surfaceContainerLow,
        },
      ]}
    >
      <View style={styles.infoWrapper}>
        <Text
          variant="labelSmall"
          style={[
            styles.versionText,
            { color: theme.colors.onSurfaceDisabled },
          ]}
        >
          CONCIERGE EDITION V1.3
        </Text>
      </View>

      <Button
        mode="outlined"
        icon="power" // 'power' or 'exit-to-app' feels more sophisticated than 'logout'
        onPress={() => setShowConfirm(true)}
        textColor={theme.colors.onSurfaceVariant}
        style={[styles.logoutButton, { borderColor: theme.colors.outline }]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Sign Out
      </Button>

      <ConfirmDialog
        visible={showConfirm}
        message="Are you sure you wish to end your current session?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={onLogout}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false} // Adjust based on your store loading states
        isRejectLoading={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  infoWrapper: {
    marginBottom: 12,
    alignItems: "center",
  },
  versionText: {
    letterSpacing: 1.5,
    fontSize: 9,
    fontWeight: "700",
  },
  logoutButton: {
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonContent: {
    height: 48,
    flexDirection: "row-reverse", // Icon on the right looks more premium in footers
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
