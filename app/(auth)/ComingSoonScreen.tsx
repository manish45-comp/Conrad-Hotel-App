import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const ComingSoonScreen: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={styles.emoji}>✨</Text>

      <Text style={styles.title}>Coming Soon</Text>

      <Text style={styles.subtitle}>
        We’re working on this feature. Stay tuned!
      </Text>

      <Button
        mode="contained-tonal"
        onPress={() => router.back()}
        style={{ marginTop: 20 }}
      >
        Back
      </Button>
    </View>
  );
};

export default ComingSoonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
    marginTop: 8,
  },
});
