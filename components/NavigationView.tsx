import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Drawer, useTheme } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DrawerButton from "./DrawerButton";

const NavigationView = ({ active, RouteKey, navigateToScreen, showModal }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontSize: 30, fontFamily: "Inter_700Bold" }}>VMS</Text>
      </View>

      {/* Scrollable Drawer Items */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 8,
          paddingTop: 4,
          paddingBottom: 12,
        }}
      >
        <Drawer.Section>
          <DrawerButton
            label="Home"
            icon="view-dashboard"
            isActive={active === RouteKey.Home}
            onPress={() => navigateToScreen(RouteKey.Home, "/dashboard/home")}
          />
          <DrawerButton
            label="Visitor List"
            icon="view-list"
            isActive={active === RouteKey.VisitorList}
            onPress={() =>
              navigateToScreen(
                RouteKey.VisitorList,
                "/dashboard/visitor-list?filter=all"
              )
            }
          />

          <DrawerButton
            label="Gate Pass"
            icon="card-account-details"
            isActive={active === RouteKey.GetPass}
            onPress={() =>
              navigateToScreen(RouteKey.GetPass, "/dashboard/get-pass")
            }
          />
          <DrawerButton
            label="Vehicle Booking"
            icon="car-clock"
            isActive={active === RouteKey.VehicleBooking}
            onPress={() =>
              navigateToScreen(
                RouteKey.VehicleBooking,
                "/dashboard/vehicle-booking"
              )
            }
          />
          <DrawerButton
            label="Lorry Receipt"
            icon="truck-check"
            isActive={active === RouteKey.LorryReceipt}
            onPress={() =>
              navigateToScreen(
                RouteKey.LorryReceipt,
                "/dashboard/lorry-receipt"
              )
            }
          />
          <DrawerButton
            label="Conference Hall"
            icon="office-building"
            isActive={active === RouteKey.ConferenceHall}
            onPress={() =>
              navigateToScreen(
                RouteKey.ConferenceHall,
                "/dashboard/conference-hall"
              )
            }
          />
          <DrawerButton
            label="Approvals"
            icon="clipboard-check"
            isActive={active === RouteKey.Approvals}
            onPress={() =>
              navigateToScreen(RouteKey.Approvals, "/dashboard/approval-list")
            }
          />
          <DrawerButton
            label="Initial Work Permit"
            icon="file-document-edit"
            isActive={active === RouteKey.InitialWorkPermit}
            onPress={() =>
              navigateToScreen(
                RouteKey.InitialWorkPermit,
                "/dashboard/work-permit-initial"
              )
            }
          />
          <DrawerButton
            label="Final Work Permit"
            icon="file-check"
            isActive={active === RouteKey.FinalWorkPermit}
            onPress={() =>
              navigateToScreen(
                RouteKey.FinalWorkPermit,
                "/dashboard/work-permit-final"
              )
            }
          />
          <DrawerButton
            label="Reports"
            icon="chart-box-outline"
            isActive={active === RouteKey.Reports}
            onPress={() =>
              navigateToScreen(RouteKey.Reports, "/dashboard/reports")
            }
          />
          <DrawerButton
            label="Approved"
            icon="check-circle-outline"
            isActive={active === RouteKey.ApprovedVisitors}
            onPress={() =>
              navigateToScreen(RouteKey.ApprovedVisitors, "/dashboard/approved")
            }
          />
          <DrawerButton
            label="Rejected"
            icon="close-circle-outline"
            isActive={active === RouteKey.RejectedVisitors}
            onPress={() =>
              navigateToScreen(RouteKey.RejectedVisitors, "/dashboard/rejected")
            }
          />
        </Drawer.Section>
      </ScrollView>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          backgroundColor: theme.colors.surface,
        }}
      >
        <Button
          mode="contained-tonal"
          icon="logout"
          onPress={showModal}
          buttonColor={theme.colors.errorContainer}
          textColor={theme.colors.error}
          style={{ width: "100%", borderRadius: 8 }}
          labelStyle={{ fontFamily: "Inter_600SemiBold" }}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default NavigationView;

const styles = StyleSheet.create({
  loadingOverlay: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },

  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
});
