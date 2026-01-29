import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

import CameraCapture from "@/components/camera/CameraCaptureExpo";
import SuccessAlert from "@/components/common/SuccessAlert";
import DetailsTab from "@/components/visitorDetails/DetailsTab";
import HeaderSection from "@/components/visitorDetails/HeaderSection";
import OtherInfoTab from "@/components/visitorDetails/OtherInfoTab";
import {
  apiVisitorCheckIn,
  apiVisitorCheckOut,
} from "@/src/api/services/visitor.service";
import { useVisitor } from "@/src/hooks/useVisitor";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorStore } from "@/src/stores/visitor.store";
import { mapVehicleTypes } from "@/src/utils/dropdownMapper";
import { isNowWithinDateRange } from "@/src/utils/helper";

// Define the luxury palette locally for the parent
const GOLD = "#C5A059";
const DARK_BG = "#121212";
const SURFACE_DARK = "#1A1A1A";

const QrDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const {
    visitor,
    loading,
    fetchVisitor,
    updateVisitor,
    actionLoading,
    updateVisitorBySecurity,
  } = useVisitor();

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const { getVehicleTypes, vehicleTypeList } = useVisitorStore();

  useEffect(() => {
    getVehicleTypes().catch(console.log);
  }, []);

  const VehicleTypeOptions = mapVehicleTypes(vehicleTypeList || []);
  const [routes] = useState([
    { key: "details", title: "Guest Profile" },
    { key: "other", title: "Logistics" },
  ]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { VehicleType: "", VehicleNumber: "", Material: [] },
  });

  type VisitorStatus = "Inside" | "Outside" | "Departed";

  const statusLabels: Record<VisitorStatus, string> = {
    Inside: "Currently Inside",
    Outside: "Not Checked in",
    Departed: "Already Out",
  };

  const userRole = user?.UserRole ?? "";
  const userId = user?.UserId;
  const isSecurityOrReception =
    userRole === "Security" || userRole === "Reception";
  const isApproved = visitor?.GatepassStatus === "Approve";
  const isInside = visitor?.VisitorStatus === "Inside";
  const isOutside = visitor?.VisitorStatus === "Outside";
  const isVendor = visitor?.VisitorType === "Vendor";
  const isWithInTheValidTime = isNowWithinDateRange(
    visitor?.FromDate,
    visitor?.ToDate,
  );
  const hasOtherInfo =
    Boolean(visitor?.VehicleType) &&
    Boolean(visitor?.VehicleNumber) &&
    Boolean(visitor?.Material);

  // Logic remains untouched, styles moved to StyleSheet
  const gatepassStatus = visitor?.GatepassStatus ?? "Pending";
  const materialOptions = [
    { label: "Laptop", icon: "laptop" },
    { label: "Bag", icon: "bag-personal" },
    { label: "Charger", icon: "power-plug-outline" },
    { label: "Wallet", icon: "wallet" },
    { label: "Mobile", icon: "cellphone" },
    { label: "Documents", icon: "file-document" },
    { label: "Others", icon: "dots-horizontal" },
  ];

  useEffect(() => {
    if (id) fetchVisitor(id);
  }, [id]);

  useEffect(() => {
    if (!visitor) return;
    reset({
      VehicleType: visitor.VehicleType ?? "",
      VehicleNumber: visitor.VehicleNumber ?? "",
      Material: visitor.Material ? visitor.Material.split("#") : [],
    });
  }, [visitor, reset]);

  const handleCheck = async (type: "in" | "out") => {
    if (!id || !userId || !userRole) return;
    try {
      if (type === "in") {
        await apiVisitorCheckIn(id, userId, userRole);
        setSuccessMsg("Check-In Confirmed");
      } else {
        await apiVisitorCheckOut(id, userId, userRole);
        setSuccessMsg("Check-Out Confirmed");
      }
      setSuccessVisible(true);
      setTimeout(() => router.replace("/(auth)/StartOptions"), 1500);
    } catch (e) {
      Alert.alert("Process Failed", "Please try again.");
    }
  };

  if (loading || actionLoading) {
    return (
      <View style={[styles.center, { backgroundColor: DARK_BG }]}>
        <ActivityIndicator color={GOLD} size="large" />
        <Text style={{ color: GOLD, marginTop: 20, letterSpacing: 2 }}>
          AUTHENTICATING...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Luxury Header Card */}
        <Surface elevation={2} style={styles.headerSurface}>
          <HeaderSection
            data={visitor}
            statusLabel={statusLabels[visitor?.VisitorStatus]}
            isGatepassApproved={isApproved}
          />
        </Surface>

        <View style={styles.tabContainer}>
          <TabView
            navigationState={{ index: tabIndex, routes }}
            onIndexChange={setTabIndex}
            initialLayout={{ width: Dimensions.get("window").width }}
            style={styles.tabView}
            renderScene={({ route }) => {
              return route.key === "details" ? (
                <DetailsTab
                  visitor={visitor}
                  gp={{}}
                  type="Security"
                  gatepassStatus={gatepassStatus}
                  isVendor={isVendor}
                />
              ) : (
                <OtherInfoTab
                  control={control}
                  errors={errors}
                  VehicleTypeOptions={VehicleTypeOptions}
                  materialOptions={materialOptions}
                  loading={loading}
                  hasOtherInfo={hasOtherInfo}
                  handleUpdate={handleSubmit(async (data) => {
                    const success = await updateVisitorBySecurity(
                      visitor.VisitorId,
                      data.VehicleType,
                      data.VehicleNumber,
                      data.Material.join("#"),
                    );
                    if (success) {
                      setSuccessMsg("Ledger Updated");
                      setSuccessVisible(true);
                    }
                  })}
                />
              );
            }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                activeColor={GOLD}
                inactiveColor="rgba(255,255,255,0.4)"
                indicatorStyle={styles.tabIndicator}
                style={styles.tabBar}
                labelStyle={styles.tabLabel}
              />
            )}
          />
        </View>
      </ScrollView>

      {/* VIP Footer Bar */}
      <Surface
        elevation={5}
        style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}
      >
        <View style={styles.buttonsRow}>
          {!visitor?.ImageUrl && isSecurityOrReception ? (
            <View style={styles.cameraWrapper}>
              <CameraCapture
                onCapture={async (base64) => {
                  const s = await updateVisitor(
                    id as string,
                    visitor.VisitorId,
                    base64,
                  );
                  Alert.alert(s ? "Profile Secured" : "Capture Failed");
                }}
              />
            </View>
          ) : null}

          {isWithInTheValidTime &&
            isApproved &&
            isOutside &&
            isSecurityOrReception &&
            visitor?.ImageUrl && (
              <Button
                mode="contained"
                icon="check-decagram"
                onPress={() => handleCheck("in")}
                style={styles.actionButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.actionButtonLabel}
              >
                GRANT ENTRY
              </Button>
            )}

          {isWithInTheValidTime && isInside && isSecurityOrReception && (
            <Button
              mode="contained"
              icon="logout-variant"
              onPress={() => handleCheck("out")}
              style={[styles.actionButton, styles.checkoutButton]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.actionButtonLabel}
            >
              FINALIZE EXIT
            </Button>
          )}
        </View>
      </Surface>

      <SuccessAlert
        visible={successVisible}
        message={successMsg}
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BG },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 120 },
  headerSurface: {
    backgroundColor: SURFACE_DARK,
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.2)",
    marginBottom: 10,
  },
  tabContainer: { flex: 1, paddingHorizontal: 20 },
  tabView: { height: 580 },
  tabBar: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    marginBottom: 10,
  },
  tabIndicator: {
    backgroundColor: GOLD,
    height: 2,
    borderRadius: 2,
    width: "30%",
    marginLeft: "10%",
  },
  tabLabel: {
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: SURFACE_DARK,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(197, 160, 89, 0.2)",
  },
  buttonsRow: { flexDirection: "row", gap: 15 },
  cameraWrapper: {
    flex: 1,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutButton: {
    backgroundColor: "#2A2A2A", // Dark luxury checkout button
    borderWidth: 1,
    borderColor: GOLD,
  },
  actionButtonLabel: {
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#fff",
  },
  buttonContent: { height: 58 },
});

export default QrDetails;
