import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, useTheme } from "react-native-paper";

type LogoutModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onLogout: () => void;
  theme: ReturnType<typeof useTheme>;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onDismiss,
  onLogout,
  theme,
}) => {
  return (
    <Portal>
      <Modal
        style={{
          flex: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
        visible={visible}
        onDismiss={onDismiss}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.onSecondary,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            Log out of your account?
          </Text>
          <Text style={[styles.message, { color: theme.colors.onSurface }]}>
            You'll need to sign back in to access your information.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onDismiss} style={styles.textButton}>
              <Text
                style={[
                  styles.textButtonLabel,
                  { color: theme.colors.onSurface },
                ]}
              >
                CANCEL
              </Text>
            </TouchableOpacity>
            <Button onPress={onLogout} mode="contained" elevation={0}>
              LOG OUT
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  modalContainer: {
    margin: "auto",
    width: "90%",
    maxWidth: 400,
    padding: 24,
    elevation: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  title: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 8,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },

  textButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
  },

  textButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  textButtonLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  textButtonLabelPrimary: {
    fontSize: 14,
    fontWeight: "500",
  },
  loadingOverlay: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
});
