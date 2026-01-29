import {
  apiVisitorCheckIn,
  apiVisitorCheckOut,
} from "@/src/api/services/visitor.service";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { Alert, BackHandler, Image, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  MD3Theme,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

const Gatepass = () => {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const { gatePassData, reset } = useVisitorFormStore();
  const viewRef = useRef<ViewShot>(null);
  const [loadedImages, setLoadedImages] = React.useState(0);
  const [isActionLoading, setActionLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit Pass?", "Return to the main screen?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Exit",
            onPress: () => {
              reset();
              router.dismissAll();
              router.replace("/(auth)/StartOptions");
            },
          },
        ]);
        return true;
      };
      const subs = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subs.remove();
    }, [reset]),
  );

  const onImageLoaded = () => setLoadedImages((prev) => prev + 1);
  const allImagesLoaded = loadedImages >= 2;
  const { user } = useAuthStore();

  const handleCheck = async (type: "in" | "out") => {
    setActionLoading(true);
    const qrId = gatePassData.cardNumber;
    try {
      const result =
        type === "in"
          ? await apiVisitorCheckIn(
              qrId.toString(),
              user?.UserId!,
              user?.UserRole!,
              "Visitor",
            )
          : await apiVisitorCheckOut(
              qrId.toString(),
              user?.UserId!,
              user?.UserRole!,
              "Visitor",
            );
      if (result) Alert.alert("Welcome", result.Message);
    } catch (e) {
      Alert.alert("Error", "Unable to complete request.");
    } finally {
      setActionLoading(false);
    }
  };

  const captureGatepass = async () => {
    try {
      const uri = await viewRef.current?.capture();
      if (!uri) return;
      await MediaLibrary.requestPermissionsAsync();
      const asset = await MediaLibrary.createAssetAsync(uri);
      Sharing.shareAsync(asset.uri);
    } catch (err) {
      console.error(err);
    }
  };

  if (!gatePassData) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrap}>
          <ViewShot
            ref={viewRef}
            options={{ format: "png", quality: 1 }}
            style={styles.capture}
          >
            <Card mode="elevated" style={styles.card} elevation={4}>
              {/* Elegant Header */}
              <View style={styles.hotelHeader}>
                <MaterialCommunityIcons
                  name="rhombus-split"
                  size={24}
                  color="#C5A059"
                />
                <Text style={styles.brandText}>
                  {gatePassData.hostCompany.toUpperCase()}
                </Text>
              </View>

              <View style={styles.imageSection}>
                <View style={styles.avatarBorder}>
                  <Avatar.Image
                    size={110}
                    source={{ uri: gatePassData.photoPath }}
                    onLoadEnd={onImageLoaded}
                    style={{ backgroundColor: "#F3F4F6" }}
                  />
                </View>
                <Text style={styles.guestName}>{gatePassData.name}</Text>
                <Text style={styles.guestCompany}>
                  {gatePassData.visitorCompany}
                </Text>
              </View>

              <View style={styles.detailsGrid}>
                <Info
                  label="TO MEET"
                  value={gatePassData.toMeet}
                  icon="account-tie-outline"
                />
                <Info
                  label="PURPOSE"
                  value={gatePassData.purpose}
                  icon="briefcase-outline"
                />
                <Info
                  label="CONTACT"
                  value={gatePassData.contact}
                  icon="phone-outline"
                />
                <Info
                  label="DATE"
                  value={gatePassData.date}
                  icon="calendar-outline"
                />
              </View>

              <View style={styles.timeBanner}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>ARRIVAL</Text>
                  <Text style={styles.timeValue}>{gatePassData.inTime}</Text>
                </View>
                <View style={styles.timeDivider} />
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>DEPARTURE</Text>
                  <Text style={styles.timeValue}>{gatePassData.outTime}</Text>
                </View>
              </View>

              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  <Image
                    source={{ uri: gatePassData.qrPath }}
                    style={styles.qr}
                    onLoadEnd={onImageLoaded}
                  />
                </View>
                <Text style={styles.visitorIdText}>
                  PASS ID: {gatePassData.visitorId}
                </Text>
              </View>

              <View style={styles.footerPattern} />
            </Card>
          </ViewShot>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            mode="contained"
            onPress={() => {
              captureGatepass();
              handleCheck("in");
            }}
            style={styles.primaryBtn}
            labelStyle={styles.btnLabel}
            loading={isActionLoading}
            disabled={!allImagesLoaded}
          >
            Check In & Save Pass
          </Button>
          <Button
            mode="text"
            onPress={() =>
              Alert.alert("Exit Pass?", "Return to the main screen?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Exit",
                  onPress: () => {
                    reset();
                    router.dismissAll();
                    router.replace("/(auth)/StartOptions");
                  },
                },
              ])
            }
            labelStyle={styles.secondaryBtnLabel}
          >
            Return to Reception
          </Button>
        </View>

        {!allImagesLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <Text style={styles.loadingText}>POLISHING YOUR PASS...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Info = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.infoBox}>
      <View style={styles.infoIconRow}>
        <MaterialCommunityIcons
          name={icon}
          size={14}
          color={theme.colors.primary}
        />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

export default Gatepass;

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      padding: 20,
      paddingBottom: 60,
    },

    centerWrap: {
      alignItems: "center",
    },

    capture: {
      borderRadius: 24,
      backgroundColor: theme.colors.onBackground,
      maxWidth: 520,
      width: "100%",
    },

    card: {
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      overflow: "hidden",
    },

    hotelHeader: {
      alignItems: "center",
      paddingTop: 30,
      paddingBottom: 20,
    },

    brandText: {
      fontSize: 20,
      fontWeight: "300",
      letterSpacing: 4,
      color: theme.colors.onSurface,
      marginTop: 8,
    },

    luxurySubtext: {
      fontSize: 10,
      letterSpacing: 2,
      color: theme.colors.primary,
      fontWeight: "700",
      marginTop: 4,
    },

    imageSection: {
      alignItems: "center",
      marginBottom: 24,
    },

    avatarBorder: {
      padding: 4,
      borderRadius: 60,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      marginBottom: 12,
    },

    guestName: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.onSurface,
    },

    guestCompany: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "400",
    },

    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 20,
      marginBottom: 20,
    },

    infoBox: {
      width: "50%",
      marginBottom: 16,
      paddingHorizontal: 4,
    },

    infoIconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 2,
    },

    infoLabel: {
      fontSize: 10,
      color: theme.colors.onSurfaceVariant,
      fontWeight: "700",
    },

    infoValue: {
      fontSize: 14,
      color: theme.colors.onSurface,
      fontWeight: "500",
    },

    timeBanner: {
      flexDirection: "row",
      backgroundColor: theme.colors.inverseSurface,
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },

    timeBlock: {
      flex: 1,
      alignItems: "center",
    },

    timeLabel: {
      fontSize: 9,
      color: theme.colors.primary,
      fontWeight: "700",
      letterSpacing: 1,
    },

    timeValue: {
      fontSize: 16,
      color: theme.colors.inverseOnSurface,
      fontWeight: "300",
      marginTop: 2,
    },

    timeDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.outlineVariant,
    },

    qrContainer: {
      alignItems: "center",
      paddingVertical: 30,
    },

    qrWrapper: {
      padding: 10,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },

    qr: {
      width: 120,
      height: 120,
    },

    visitorIdText: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      marginTop: 12,
      letterSpacing: 1,
    },

    footerPattern: {
      height: 6,
      backgroundColor: theme.colors.primary,
      width: "100%",
    },

    buttonGroup: {
      marginTop: 30,
      gap: 10,
      alignSelf: "center",
      maxWidth: 520,
      width: "100%",
    },

    primaryBtn: {
      borderRadius: 12,
      backgroundColor: theme.colors.inverseSurface,
      paddingVertical: 6,
    },

    btnLabel: {
      color: theme.colors.primary,
      fontWeight: "700",
      letterSpacing: 1,
    },

    secondaryBtnLabel: {
      color: theme.colors.onBackground,
      fontSize: 14,
    },

    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.backdrop ?? "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },

    loadingText: {
      marginTop: 15,
      fontSize: 12,
      letterSpacing: 2,
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });
