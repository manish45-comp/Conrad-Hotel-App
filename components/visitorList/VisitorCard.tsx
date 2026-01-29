import { formatDateOnly } from "@/src/utils/date";
import { maskNumber } from "@/src/utils/mask";
import { VisitorItem } from "@/src/utils/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";
import ActionIconButton from "../common/ActionIconButton";

// Reimagined Status Mapping for Luxury Theme
const getStatusConfig = (label: string, theme: any) => {
  switch (label) {
    case "Approved":
      return {
        border: theme.colors.success,
        text: theme.colors.success,
        icon: "check-decagram",
      };
    case "Rejected":
      return {
        border: theme.colors.error,
        text: theme.colors.error,
        icon: "alert-circle",
      };
    default:
      return {
        border: theme.colors.outline,
        text: theme.colors.onSurfaceVariant,
        icon: "clock-outline",
      };
  }
};

interface Props {
  visitor: VisitorItem;
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
  actionsVisible: boolean;
  isApproveLoading: boolean;
  isRejectLoading: boolean;
}

const VisitorCard: React.FC<Props> = ({
  visitor,
  onAccept,
  onReject,
  loading,
  actionsVisible,
}) => {
  const theme = useTheme();

  const isApproved =
    visitor.AuthorityApproval === "Approved" &&
    visitor.EmployeeApproval === "Approved";
  const isRejected =
    visitor.AuthorityApproval === "Rejected" ||
    visitor.EmployeeApproval === "Rejected";
  const showActionButtons = isApproved || isRejected;

  const StatusBadge = ({ label, role }: { label: string; role: string }) => {
    const config = getStatusConfig(label, theme);
    return (
      <View style={[styles.badge, { borderColor: config.border }]}>
        <MaterialCommunityIcons
          name={config.icon as any}
          size={10}
          color={config.text}
        />
        <Text style={[styles.badgeText, { color: config.text }]}>
          {role}: {label}
        </Text>
      </View>
    );
  };

  return (
    <Surface
      elevation={1}
      style={[
        styles.cardSurface,
        { backgroundColor: theme.colors.surfaceContainerLow },
      ]}
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceContainerHigh },
        ]}
        elevation={0}
      >
        <Card.Content style={styles.content}>
          {/* Header: Name & ID */}
          <View style={styles.header}>
            <View style={styles.nameContainer}>
              <Text
                variant="titleMedium"
                style={[styles.visitorName, { color: theme.colors.onSurface }]}
              >
                {visitor.VisitorName}
              </Text>
              <Text
                variant="labelSmall"
                style={[styles.visitorId, { color: theme.colors.primary }]}
              >
                REGISTRY ID #{visitor.VisitorId}
              </Text>
            </View>
            <View
              style={[
                styles.dateBox,
                { backgroundColor: theme.colors.surfaceContainerHigh },
              ]}
            >
              <Text
                style={[styles.dateText, { color: theme.colors.onSurface }]}
              >
                {formatDateOnly(visitor.FromDate)}
              </Text>
            </View>
          </View>

          {/* Luxury Info Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="phone"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {maskNumber(visitor.ContactNumber)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons
                name="clock-time-four-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {visitor.InTime || "--"} — {visitor.OutTime || "--"}
              </Text>
            </View>
            <View style={[styles.infoItem, { flexBasis: "100%" }]}>
              <MaterialCommunityIcons
                name="text-account"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                numberOfLines={1}
              >
                {visitor.Purpose || "General Visit"}
              </Text>
            </View>
          </View>

          {/* Approval Tracking */}
          <View style={styles.statusRow}>
            <StatusBadge label={visitor.EmployeeApproval} role="Host" />
            <StatusBadge label={visitor.AuthorityApproval} role="Security" />
          </View>

          {/* Actions - Stylized with Theme Colors */}
          {!showActionButtons && actionsVisible && (
            <View style={styles.actionRow}>
              <ActionIconButton
                loading={loading}
                bg={theme.colors.successContainer}
                color={theme.colors.onSuccess}
                title="Authorize"
                icon="check-circle-outline"
                onPress={onAccept}
              />
              <ActionIconButton
                loading={loading}
                bg={theme.colors.errorContainer}
                color={theme.colors.onError}
                title="Decline"
                icon="close-circle-outline"
                onPress={onReject}
              />
            </View>
          )}
        </Card.Content>
      </Card>
    </Surface>
  );
};

export default memo(VisitorCard, (prev, next) => {
  return (
    prev.visitor.VisitorId === next.visitor.VisitorId &&
    prev.visitor.AuthorityApproval === next.visitor.AuthorityApproval &&
    prev.visitor.EmployeeApproval === next.visitor.EmployeeApproval &&
    prev.loading === next.loading
  );
});

const styles = StyleSheet.create({
  cardSurface: {
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  card: {
    width: "100%",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
  },
  visitorName: {
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.3,
  },
  visitorId: {
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 2,
    opacity: 0.8,
  },
  dateBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "500",
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100, // Pill shape
    borderWidth: 1,
    gap: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
});
