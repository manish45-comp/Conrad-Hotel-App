import { useAuthStore } from "@/src/stores/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StatusBar, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Surface, Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Images
import ConfirmDialog from "@/components/common/ConfirmDialog";
import logo from "../../assets/images/icon-removebg.png";
import etrackinfo from "../../assets/images/icon_logo.png";

const useScaleAnimation = () => {
  const scale = useSharedValue(1);
  const onPressIn = () => {
    scale.value = withSpring(0.97);
  };
  const onPressOut = () => {
    scale.value = withSpring(1);
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return { onPressIn, onPressOut, animatedStyle };
};

const StartOptions: React.FC = () => {
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withSpring(0);
  }, []);

  const entryStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const addBtn = useScaleAnimation();
  const dashBtn = useScaleAnimation();
  const qrBtn = useScaleAnimation();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ConfirmDialog
        visible={showConfirm}
        message="Are you sure you wish to end your current session?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* 1. Elegant Header */}
        <View style={styles.header}>
          <Image source={logo} style={styles.hotelLogo} resizeMode="contain" />
          <View
            style={[styles.goldLine, { backgroundColor: theme.colors.primary }]}
          />
          <Text
            style={[styles.managementText, { color: theme.colors.primary }]}
          >
            VISITOR MANAGEMENT
          </Text>
        </View>

        <Animated.View style={[styles.mainContent, entryStyle]}>
          {/* 2. Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={[styles.greeting, { color: theme.colors.secondary }]}>
              Welcome Back,
            </Text>
            <Text style={styles.userName}>
              {user?.UserName?.toUpperCase() || "CONCIERGE"}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={[styles.roleText, { color: theme.colors.primary }]}>
                {user?.UserRole || "Staff"}
              </Text>
            </View>
          </View>

          {/* 3. Action Menu */}
          <View style={styles.menuGrid}>
            <MenuButton
              theme={theme}
              anim={addBtn}
              icon="account-plus-outline"
              label="REGISTER VISITOR"
              subtitle="Create new guest credentials"
              onPress={() => router.push("/visitor-form")}
              primary
            />

            <MenuButton
              theme={theme}
              anim={qrBtn}
              icon="qrcode-scan"
              label="SCAN ACCESS PASS"
              subtitle="Verify entry/exit QR codes"
              onPress={() =>
                router.push({
                  pathname: "/(scanner)/QrScanner",
                })
              }
            />

            <MenuButton
              theme={theme}
              anim={dashBtn}
              icon="view-dashboard-variant-outline"
              label="DASHBOARD"
              subtitle="Real-time occupancy & logs"
              onPress={() => router.push("/dashboard/home")}
            />
          </View>
        </Animated.View>

        {/* 4. Luxury Footer */}
        <View style={styles.footer}>
          <Button
            onPress={() => setShowConfirm(true)}
            mode="text"
            icon="power"
            textColor={theme.colors.secondary}
            labelStyle={styles.logoutLabel}
          >
            TERMINATE SESSION
          </Button>

          <View style={styles.devSection}>
            <Text style={[styles.poweredBy, { color: theme.colors.secondary }]}>
              POWERED BY
            </Text>
            <Image
              source={etrackinfo}
              style={styles.devLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

/* --- Refined Menu Button Component --- */
const MenuButton = ({
  anim,
  icon,
  label,
  subtitle,
  onPress,
  primary = false,
  theme,
}: any) => {
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      onPressIn={anim.onPressIn}
      onPressOut={anim.onPressOut}
      onPress={onPress}
    >
      <Animated.View style={[anim.animatedStyle]}>
        <Surface
          style={[styles.menuTile, primary && styles.primaryTile]}
          elevation={primary ? 4 : 0}
        >
          <View style={[styles.iconBox, primary && styles.primaryIconBox]}>
            <MaterialCommunityIcons
              name={icon}
              size={26}
              color={primary ? "#1A1A1A" : "#C5A059"}
            />
          </View>
          <View style={styles.tileTextContent}>
            <Text
              style={[styles.tileLabel, primary && styles.primaryTileLabel]}
            >
              {label}
            </Text>
            <Text style={[styles.tileSub, primary && styles.primaryTileSub]}>
              {subtitle}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={primary ? "#1A1A1A" : "rgba(255,255,255,0.2)"}
          />
        </Surface>
      </Animated.View>
    </Pressable>
  );
};

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    safeArea: { flex: 1 },
    header: { alignItems: "center", paddingTop: 40, paddingBottom: 20 },
    hotelLogo: { height: 50, width: 160 },
    goldLine: {
      width: 30,
      height: 1,

      marginVertical: 10,
    },
    managementText: {
      fontSize: 10,
      letterSpacing: 3,
      fontWeight: "600",
    },

    mainContent: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
    welcomeSection: { alignItems: "center", marginBottom: 40 },
    greeting: { opacity: 0.6, fontSize: 14, letterSpacing: 1 },
    userName: {
      fontSize: 24,
      fontWeight: "300",
      letterSpacing: 4,
      marginTop: 4,
    },
    roleBadge: {
      marginTop: 10,
      paddingHorizontal: 12,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: theme.colors.inversePrimary,
      borderRadius: 4,
    },
    roleText: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1,
    },

    menuGrid: { gap: 16, maxWidth: 400, width: "100%", alignSelf: "center" },
    menuTile: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.tertiaryContainer,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#333",
    },
    primaryTile: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: "#1A1A1A",
      justifyContent: "center",
      alignItems: "center",
    },
    primaryIconBox: {
      backgroundColor: theme.colors.backdropLowest,
    },
    tileTextContent: { flex: 1, marginLeft: 16 },
    tileLabel: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 1.5,
    },
    tileSub: { color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 },
    primaryTileLabel: { color: theme.colors.onPrimary },
    primaryTileSub: { color: theme.colors.onSecondary },

    footer: { alignItems: "center" },
    logoutLabel: { fontSize: 11, letterSpacing: 2, fontWeight: "600" },
    devSection: { alignItems: "center", marginTop: 20 },
    poweredBy: {
      fontSize: 8,
      opacity: 0.5,
      letterSpacing: 2,
      marginBottom: 5,
    },
    devLogo: { height: 18, width: 80, opacity: 0.3 },
  });

export default StartOptions;
