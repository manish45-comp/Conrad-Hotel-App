import { StepIndicator } from "@/components/common/StepIndicator";
import { useVisitorLookup } from "@/src/hooks/useVisitorLookup";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  MD3Theme,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StepOne() {
  const theme = useTheme();
  const { mobile, setField, reset } = useVisitorFormStore();
  const { lookupVisitor, loading } = useVisitorLookup();
  const [error, setError] = useState<string | null>(null);

  const onNext = async () => {
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    try {
      const exists = await lookupVisitor(mobile);
      if (!exists) {
        console.log("Visitor not registered, creating new.");
      }
    } catch (err) {
      console.log("Lookup failed:", err);
    }

    router.push("/visitor-form/capture");
  };

  const styles = React.useMemo(() => makeStyle(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StepIndicator step={1} total={5} title="Verification" />

        <View style={styles.body}>
          <View style={styles.welcomeBox}>
            <Text style={styles.luxuryTitle}>
              VENDOR/VISITOR IDENTIFICATION
            </Text>
            <Text style={styles.luxurySubtitle}>
              Please provide the visitor's mobile number to verify their
              profile.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              mode="flat"
              label="Contact Number"
              placeholder="Enter 10 digits"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              textColor="#FFF"
              activeUnderlineColor="#C5A059"
              underlineColor="rgba(197, 160, 89, 0.3)"
              left={<TextInput.Icon icon="phone-outline" color="#C5A059" />}
              onChangeText={(v) => {
                setError(null);
                setField("mobile", v);
              }}
              error={!!error}
              style={styles.input}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={onNext}
            disabled={loading}
            loading={loading}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            VERIFY GUEST
          </Button>

          <Button
            mode="text"
            onPress={() => {
              reset();
              router.back();
            }}
            textColor="rgba(255,255,255,0.4)"
            style={{ marginTop: 8 }}
          >
            CANCEL
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
    },
    body: {
      flex: 1,
      justifyContent: "center",
      paddingBottom: 40,
    },
    welcomeBox: {
      marginBottom: 40,
    },
    luxuryTitle: {
      color: theme.colors.onBackground,
      fontSize: 22,
      fontWeight: "300",
      letterSpacing: 4,
      marginBottom: 12,
    },
    luxurySubtitle: {
      color: theme.colors.secondary,
      fontSize: 14,
      lineHeight: 22,
      letterSpacing: 0.5,
    },
    inputContainer: {
      marginTop: 10,
    },
    input: {
      backgroundColor: "transparent",
      height: 64,
      fontSize: 18,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 11,
      marginTop: 8,
      letterSpacing: 1,
      fontWeight: "600",
    },
    footer: {
      paddingVertical: 32,
    },
    button: {
      borderRadius: 0, // Sharp luxury edges
    },
    buttonContent: {
      height: 56,
    },
    buttonLabel: {
      fontWeight: "700",
      letterSpacing: 2,
      fontSize: 14,
    },
  });
