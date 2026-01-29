import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, useWindowDimensions, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Portal,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { RememberMeRow } from "@/components/login/RememberMeRow";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function LoginScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const { login } = useAuthStore();
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, msg: "" });

  const showSnackbar = (msg: string) => setSnackbar({ visible: true, msg });

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("remember_username");
      if (saved) {
        setUsername(saved);
        setRememberMe(true);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (loading) return;
    if (!username.trim() || !password.trim()) {
      return showSnackbar("Credentials required");
    }

    setLoading(true);
    try {
      const success = await login(username, password);
      if (!success) return showSnackbar("Invalid credentials");

      if (rememberMe) await AsyncStorage.setItem("remember_username", username);
      else await AsyncStorage.removeItem("remember_username");

      showSnackbar("Welcome back!");
      setTimeout(() => router.replace("/(auth)/StartOptions"), 800);
    } catch (e) {
      showSnackbar("System Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[styles.innerContainer, { minHeight: height - inset.top }]}
          >
            {/* 1. Header Section - Luxury Branding */}
            <View style={styles.header}>
              <MaterialCommunityIcons
                name="rhombus-split"
                size={40}
                color={theme.colors.primary}
              />
              <Text style={styles.brandTitle}>THE CONRAD HOTEL</Text>
              <View
                style={[
                  styles.separator,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
                CONCIERGE & VISITOR MANAGEMENT
              </Text>
            </View>

            {/* 2. Form Section */}
            <View style={styles.formSection}>
              <Text
                style={[styles.loginLabel, { color: theme.colors.secondary }]}
              >
                RECEPTION LOGIN
              </Text>

              <TextInput
                label="Identity / Username"
                value={username}
                onChangeText={setUsername}
                mode="flat"
                autoCapitalize="none"
                textColor={theme.colors.onBackground}
                activeUnderlineColor={theme.colors.primary}
                underlineColor="rgba(197, 160, 89, 0.3)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon="account-outline"
                    color={theme.colors.primary}
                  />
                }
              />

              <TextInput
                label="Secure Password"
                value={password}
                onChangeText={setPassword}
                mode="flat"
                secureTextEntry
                textColor={theme.colors.onBackground}
                activeUnderlineColor={theme.colors.primary}
                underlineColor="rgba(197, 160, 89, 0.3)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon="lock-outline"
                    color={theme.colors.primary}
                  />
                }
              />

              <View style={styles.optionsRow}>
                <RememberMeRow
                  checked={rememberMe}
                  onToggle={() => setRememberMe(!rememberMe)}
                  textColor={{ color: theme.colors.secondary }}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                AUTHORIZE ACCESS
              </Button>
            </View>

            {/* 3. Footer Section */}
            <View style={styles.footer}>
              <Text
                style={[styles.versionText, { color: theme.colors.secondary }]}
              >
                SYSTEM v1.3.0
              </Text>
              <Text
                style={[
                  styles.copyrightText,
                  { color: theme.colors.secondary },
                ]}
              >
                © {new Date().getFullYear()} VANIA SOLUTIONS PVT. LTD.
              </Text>
              <View
                style={[
                  styles.goldBar,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      <Portal>
        <View
          style={{
            position: "absolute",
            top: 200, // adjust based on device notch
            left: 0,
            right: 0,
            zIndex: 9999,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Snackbar
            visible={snackbar.visible}
            onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
            duration={2000}
            wrapperStyle={{ width: "50%" }}
            style={[
              styles.snackbar,
              {
                backgroundColor:
                  snackbar.msg === "Welcome back!" ? "green" : "red",
              },
            ]}
          >
            <Text style={styles.snackbarText}>{snackbar.msg}</Text>
          </Snackbar>
        </View>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 32,
    justifyContent: "space-between",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandTitle: {
    fontSize: 24,
    letterSpacing: 6,
    fontWeight: "300",
    marginTop: 15,
    textAlign: "center",
  },
  separator: {
    width: 40,
    height: 1,

    marginVertical: 12,
  },
  subtitle: {
    fontSize: 10,

    letterSpacing: 2,
    fontWeight: "600",
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  loginLabel: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "transparent",
    marginBottom: 20,
    fontSize: 15,
  },
  optionsRow: {
    marginBottom: 30,
    marginTop: -10,
  },
  loginButton: {
    borderRadius: 0,
    marginTop: 10,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 24,
    marginTop: 40,
  },
  versionText: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.5,
  },
  copyrightText: {
    fontSize: 9,
    letterSpacing: 1,
    opacity: 0.5,
  },
  rememberMe: {
    fontSize: 12,
    letterSpacing: 1,
  },
  goldBar: {
    width: 20,
    height: 3,
    marginTop: 15,
  },
  snackbar: {
    borderRadius: 0,
  },
  snackbarText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
  },
});
