import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar as RNStatusBar, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import AddVisitorButton from "@/components/visitorList/AddVisitorButton";
import DateFilters from "@/components/visitorList/DateFilters";
import VisitorCardList from "@/components/visitorList/VisitorCardList";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorStore } from "@/src/stores/visitor.store";
import { formatForAPI } from "@/src/utils/date";

type PendingAction = "approve" | "reject" | null;

export default function VisitorList() {
  const theme = useTheme();
  const { user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const initialFrom = useRef(new Date());
  const initialTo = useRef(new Date());

  const [fromDate, setFromDate] = useState(initialFrom.current);
  const [toDate, setToDate] = useState(initialTo.current);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [pendingVisitorId, setPendingVisitorId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<
    "approved" | "rejected" | "error" | null
  >(null);

  const {
    visitorsList,
    getVisitorList,
    loading,
    isApproveLoading,
    isRejectLoading,
    actionVisitorId,
    ApproveVisitorByAdmin,
    RejectVisitorByAdmin,
  } = useVisitorStore();

  const showStatus = (type: "approved" | "rejected" | "error") => {
    setStatusMessage(type);
    setTimeout(() => setStatusMessage(null), 2000);
  };

  const updateVisitorStatus = (
    visitorId: number,
    status: "Approved" | "Rejected",
  ) => {
    useVisitorStore.setState((state) => ({
      visitorsList: state.visitorsList?.map((v) =>
        v.VisitorId === visitorId
          ? { ...v, AuthorityApproval: status, EmployeeApproval: status }
          : v,
      ),
    }));
  };

  const filteredVisitors = React.useMemo(() => {
    if (!searchQuery.trim()) return visitorsList || [];
    const q = searchQuery.toLowerCase();
    return (visitorsList || []).filter(
      (v) =>
        v.VisitorName?.toLowerCase().includes(q) ||
        v.ContactNumber?.includes(q) ||
        String(v.VisitorId).includes(q),
    );
  }, [visitorsList, searchQuery]);

  const fetchVisitors = async () => {
    if (!user?.UserId) return;
    await getVisitorList(
      user.UserId,
      formatForAPI(fromDate),
      formatForAPI(toDate),
    );
  };

  useEffect(() => {
    fetchVisitors();
  }, [user?.UserId, fromDate.getTime(), toDate.getTime()]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery("");
    await fetchVisitors();
    setRefreshing(false);
  }, [fromDate, toDate]);

  const handleApprove = async (visitorId: number) => {
    if (!user?.UserId) return;
    const success = await ApproveVisitorByAdmin(visitorId, user.UserId);
    if (success) {
      updateVisitorStatus(visitorId, "Approved");
      showStatus("approved");
    } else {
      showStatus("error");
      fetchVisitors();
    }
  };

  const handleReject = async (visitorId: number) => {
    if (!user?.UserId) return;
    const success = await RejectVisitorByAdmin(visitorId, user.UserId);
    if (success) {
      updateVisitorStatus(visitorId, "Rejected");
      showStatus("rejected");
    } else {
      showStatus("error");
      fetchVisitors();
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <RNStatusBar barStyle="light-content" />

      {/* Floating Status Notification */}
      {statusMessage && (
        <Surface
          elevation={5}
          style={[
            styles.statusPill,
            { backgroundColor: theme.colors.surfaceBright },
          ]}
        >
          <View
            style={[
              styles.indicator,
              {
                backgroundColor:
                  statusMessage === "approved"
                    ? theme.colors.success
                    : theme.colors.error,
              },
            ]}
          />
          <Text style={[styles.statusText, { color: theme.colors.onSurface }]}>
            {statusMessage === "approved"
              ? "Entry Authorized"
              : statusMessage === "rejected"
                ? "Entry Denied"
                : "System Error"}
          </Text>
        </Surface>
      )}

      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        {/* Header Search & Filter Section */}
        <Surface
          elevation={0}
          style={[
            styles.header,
            { backgroundColor: theme.colors.surfaceContainer },
          ]}
        >
          <Searchbar
            placeholder="Search guests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="bar"
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            iconColor={theme.colors.primary}
            style={[
              styles.searchBar,
              { backgroundColor: theme.colors.surfaceContainerHigh },
            ]}
            inputStyle={[styles.searchInput, { color: theme.colors.onSurface }]}
          />
          <DateFilters
            fromDate={fromDate}
            toDate={toDate}
            showFrom={showFromPicker}
            showTo={showToPicker}
            setShowFrom={setShowFromPicker}
            setShowTo={setShowToPicker}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Surface>

        <View style={{ flex: 1 }}>
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : (
            <VisitorCardList
              visitors={filteredVisitors}
              loadingId={actionVisitorId}
              isApproveLoading={isApproveLoading}
              isRejectLoading={isRejectLoading}
              onAccept={(Id) => {
                setPendingVisitorId(Id);
                setPendingAction("approve");
                setShowDialog(true);
              }}
              onReject={(Id) => {
                setPendingVisitorId(Id);
                setPendingAction("reject");
                setShowDialog(true);
              }}
              refreshing={refreshing}
              onRefresh={onRefresh}
              actionsVisible={user?.UserRole === "Reception"}
            />
          )}
        </View>
      </SafeAreaView>

      <ConfirmDialog
        visible={showDialog}
        isApproveLoading={isApproveLoading}
        isRejectLoading={isRejectLoading}
        message={
          pendingAction === "approve"
            ? "Confirm entry approval for this visitor?"
            : "Are you sure you want to deny entry?"
        }
        confirmText={pendingAction === "approve" ? "Approve" : "Reject"}
        onConfirm={() =>
          (pendingAction === "approve"
            ? handleApprove(pendingVisitorId!)
            : handleReject(pendingVisitorId!)
          ).then(() => setShowDialog(false))
        }
        onCancel={() => setShowDialog(false)}
      />

      <AddVisitorButton
        title="New Entry"
        path="dashboard/visitor-add"
        visible={user?.UserRole === "Employee"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontWeight: "800",
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  searchBar: {
    borderRadius: 12,
    height: 52,
    marginBottom: 12,
    elevation: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  statusPill: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.2)", // Subtle gold border
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
