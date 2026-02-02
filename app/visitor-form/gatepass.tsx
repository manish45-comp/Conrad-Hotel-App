import ConfirmDialog from "@/components/common/ConfirmDialog";
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
  MD3Theme,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";

const Gatepass = () => {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const { reset, gatePassData } = useVisitorFormStore();
  const viewRef = useRef<ViewShot>(null);
  const [loadedImages, setLoadedImages] = React.useState(0);
  const [isActionLoading, setActionLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setCancelShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

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
            )
          : await apiVisitorCheckOut(
              qrId.toString(),
              user?.UserId!,
              user?.UserRole!,
            );
      if (result) {
        console.log(result);
        setMessage(result?.Message);
        setShowConfirm(true);
      }
    } catch (e) {
      console.log(e);
      setMessage("Unable to complete request.");
      setShowConfirm(true);
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

  const handleExitSession = () => {
    reset();
    setShowConfirm(false);
    router.dismissAll();
    router.replace("/(auth)/StartOptions");
  };

  // const gatePassDatad = {
  //   cardNumber: "93220225",
  //   contact: "7040270156",
  //   date: "30/01/2026",
  //   hostCompany: "Conrad Pune",
  //   id: "147",
  //   inTime: "12:35 PM",
  //   logoPath: "https://vms.vaniasolutions.com/dist/img/Companylogo.png",
  //   name: "Manish Bagal",
  //   outTime: "11:00 PM",
  //   photoPath:
  //     "https://vms.vaniasolutions.com/Uploads/Photos/6c8c9a34-4fe3-45b6-8e7f-385b474e1533.jpg",
  //   purpose: "Meeting",
  //   qrPath: "https://vms.vaniasolutions.com/QRCODE/93220225.png",
  //   toMeet: "Gate-1 Security",
  //   visitorCompany: "Vania Solutions Private Limited ",
  //   visitorId: "461763",
  //   watermarkPath: "https://vms.vaniasolutions.com/dist/img/Watermark.png",
  // };

  if (!gatePassData) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ConfirmDialog
        visible={showConfirm}
        message={message}
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <ConfirmDialog
        visible={showCancelConfirm}
        message={message}
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={handleExitSession}
        onCancel={() => setCancelShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          {/* PREMIUM UI VIEW (Screen Display) */}
          <Surface style={styles.uiCard} elevation={2}>
            <View style={styles.uiHeader}>
              <View style={styles.uiHeaderRight}>
                <Text style={styles.uiHostName}>
                  {gatePassData.hostCompany.toUpperCase()}
                </Text>
                <Text style={styles.uiPassType}>VISITOR</Text>
              </View>
            </View>

            <View style={styles.uiMain}>
              <Avatar.Image
                size={110}
                source={{ uri: gatePassData.photoPath }}
                style={styles.uiAvatar}
              />
              <Text style={styles.uiName}>{gatePassData.name}</Text>
              <Text style={styles.uiCompany}>
                {gatePassData.visitorCompany}
              </Text>
              <View style={styles.uiContactRow}>
                <MaterialCommunityIcons
                  name="phone"
                  size={14}
                  color="#C5A059"
                />
                <Text style={styles.uiContactText}>{gatePassData.contact}</Text>
              </View>
            </View>

            <View style={styles.uiDetails}>
              <View style={styles.uiInfoRow}>
                <View>
                  <Text style={styles.uiLabel}>HOSTING EXECUTIVE</Text>
                  <Text style={styles.uiValue}>{gatePassData.toMeet}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.uiLabel}>VISIT DATE</Text>
                  <Text style={styles.uiValue}>{gatePassData.date}</Text>
                </View>
              </View>

              <View style={styles.uiInfoRow}>
                <View>
                  <Text style={styles.uiLabel}>PURPOSE</Text>
                  <Text style={styles.uiValue}>{gatePassData.purpose}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.uiLabel}>VISITOR ID</Text>
                  <Text style={styles.uiValue}>#{gatePassData.visitorId}</Text>
                </View>
              </View>

              <View style={styles.uiInfoRow}>
                <View>
                  <Text style={styles.uiLabel}>CHECK-IN</Text>
                  <Text style={styles.uiValue}>{gatePassData.inTime}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.uiLabel}>EXPECTED OUT</Text>
                  <Text style={styles.uiValue}>{gatePassData.outTime}</Text>
                </View>
              </View>

              <View style={styles.uiFooterDetails}>
                <Text style={styles.uiCardNum}>
                  CARD: {gatePassData.cardNumber}
                </Text>
                <Text style={styles.uiRegId}>REG: {gatePassData.id}</Text>
              </View>
            </View>
          </Surface>
          {!allImagesLoaded && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingBox}>
                <ActivityIndicator color="#C5A059" size="small" />
                <Text style={styles.loadingText}>PREPARING SECURE PASS...</Text>
              </View>
            </View>
          )}

          {/* PRINT TEMPLATE (Hidden from UI, used for ViewShot) */}
          <View style={styles.offscreenContainer}>
            <ViewShot
              ref={viewRef}
              options={{ format: "png", quality: 1 }}
              style={styles.printTemplate}
            >
              {/* FRONT FOLD (Top) */}
              <View style={styles.printHalf}>
                <View style={styles.printHeaderRow}>
                  <Text style={styles.printBrandText}>
                    {gatePassData.hostCompany.toUpperCase()}
                  </Text>
                </View>
                <Image
                  source={{ uri: gatePassData.photoPath }}
                  style={styles.printPhoto}
                  onLoadEnd={onImageLoaded}
                />
                <Text style={styles.printNameText}>{gatePassData.name}</Text>
                <Text style={styles.printCompanyText}>
                  {gatePassData.visitorCompany}
                </Text>
                <View style={styles.printMetaRow}>
                  <Text style={styles.printMetaLabel}>
                    ID: {gatePassData.visitorId}
                  </Text>
                  <Text style={styles.printMetaLabel}>
                    PH: {gatePassData.contact}
                  </Text>
                </View>
              </View>

              {/* FOLD LINE */}
              <View style={styles.foldIndicator}>
                <View style={styles.foldDash} />
                <MaterialCommunityIcons
                  name="scissors-cutting"
                  size={12}
                  color="#AAA"
                />
                <View style={styles.foldDash} />
              </View>

              {/* BACK FOLD (Bottom) */}
              <View style={styles.printHalf}>
                <View style={styles.printPurposeBox}>
                  <Text style={styles.printPurposeLabel}>
                    PURPOSE: {gatePassData.purpose.toUpperCase()}
                  </Text>
                  <Text style={styles.printPurposeLabel}>
                    MEETING: {gatePassData.toMeet}
                  </Text>
                </View>

                <Image
                  source={{ uri: gatePassData.qrPath }}
                  style={styles.printQr}
                  onLoadEnd={onImageLoaded}
                />

                <View style={styles.printGrid}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gl}>DATE</Text>
                    <Text style={styles.gv}>{gatePassData.date}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gl}>IN</Text>
                    <Text style={styles.gv}>{gatePassData.inTime}</Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gl}>OUT</Text>
                    <Text style={styles.gv}>{gatePassData.outTime}</Text>
                  </View>
                </View>

                <View style={styles.printFooterRow}>
                  <Text style={styles.printFooterText}>
                    CARD NO: {gatePassData.cardNumber}
                  </Text>
                  <Text style={styles.printFooterText}>
                    REF: {gatePassData.id}
                  </Text>
                </View>
              </View>
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
              contentStyle={{ height: 56 }}
              textColor={theme.colors.onBackground}
              loading={isActionLoading}
              disabled={!allImagesLoaded}
            >
              Issue Pass & Check-In
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setMessage("Return to the main screen?");
                setCancelShowConfirm(true);
              }}
              labelStyle={{ color: "#666" }}
            >
              Cancel Request
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Gatepass;

export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F9F9F9" },
    scrollContent: { padding: 16, alignItems: "center" },

    // UI CARD STYLES
    uiCard: {
      width: "100%",
      maxWidth: 450,
      backgroundColor: "#FFF",
      borderRadius: 28,
      overflow: "hidden",
      paddingBottom: 25,
      alignSelf: "center",
    },
    uiHeader: {
      backgroundColor: "#1A1A1A",
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    uiLogo: { width: 40, height: 40, marginRight: 12 },
    uiHeaderRight: { flex: 1 },
    uiHostName: {
      color: "#C5A059",
      fontWeight: "300",
      letterSpacing: 1.5,
      fontSize: 12,
    },
    uiPassType: {
      color: "#FFF",
      fontSize: 10,
      fontWeight: "700",
      opacity: 0.8,
    },
    uiMain: { alignItems: "center", marginTop: -40 },
    uiAvatar: { borderWidth: 4, borderColor: "#FFF", elevation: 8 },
    uiName: {
      fontSize: 24,
      fontWeight: "800",
      color: "#1A1A1A",
      marginTop: 12,
    },
    uiCompany: {
      fontSize: 12,
      color: "#C5A059",
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    uiContactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 5,
    },
    uiContactText: { fontSize: 11, color: "#888" },
    uiDetails: { paddingHorizontal: 20, marginTop: 25, gap: 18 },
    uiInfoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
      paddingBottom: 8,
    },
    uiLabel: {
      fontSize: 8,
      color: "#BBB",
      fontWeight: "bold",
      marginBottom: 2,
    },
    uiValue: { fontSize: 13, color: "#333", fontWeight: "600" },
    uiFooterDetails: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 15,
      marginTop: 10,
    },
    uiCardNum: { fontSize: 9, color: "#AAA", fontWeight: "600" },
    uiRegId: { fontSize: 9, color: "#AAA", fontWeight: "600" },

    // PRINT TEMPLATE STYLES
    offscreenContainer: { position: "absolute", left: -2000 },
    printTemplate: {
      width: 400,
      height: 750,
      backgroundColor: "#FFF",
      padding: 30,
    },
    printHalf: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#F0F0F0",
      borderRadius: 8,
    },
    printHeaderRow: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    },

    printBrandText: {
      color: "#000",
      fontSize: 14,
      letterSpacing: 3,
      fontWeight: "bold",
    },
    printPhoto: { width: 130, height: 130, marginBottom: 15 },
    printNameText: { color: "#000", fontSize: 22, fontWeight: "bold" },
    printCompanyText: { fontSize: 12, color: "#555", marginBottom: 10 },
    printMetaRow: { flexDirection: "row", gap: 15 },
    printMetaLabel: { fontSize: 10, color: "#888", fontWeight: "bold" },

    foldIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginVertical: 10,
    },
    foldDash: {
      flex: 1,
      height: 1,
      backgroundColor: "#DDD",
      borderStyle: "dashed",
    },

    printPurposeBox: {
      backgroundColor: "#F9F9F9",
      padding: 10,
      width: "90%",
      borderRadius: 4,
      marginBottom: 15,
    },
    printPurposeLabel: {
      fontSize: 9,
      textAlign: "center",
      fontWeight: "bold",
      color: "#444",
    },
    printQr: { width: 140, height: 140 },
    printGrid: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-around",
      marginTop: 15,
    },
    gridItem: { alignItems: "center" },
    gl: { fontSize: 8, color: "#AAA", fontWeight: "bold" },
    gv: { fontSize: 11, fontWeight: "700", color: "#000" },
    printFooterRow: { flexDirection: "row", gap: 20, marginTop: 15 },
    printFooterText: { fontSize: 9, color: "#999", fontWeight: "bold" },

    buttonGroup: {
      marginTop: 25,
      width: "100%",
      maxWidth: 450,
      gap: 8,
      alignSelf: "center",
    },
    primaryBtn: { borderRadius: 14 },

    cardContainer: {
      width: "100%",
      position: "relative", // Necessary for absolute overlay
    },

    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      zIndex: 10,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingBox: {
      alignItems: "center",
      gap: 12,
    },

    loadingText: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#C5A059",
      letterSpacing: 2,
    },
  });
