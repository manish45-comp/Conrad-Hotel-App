import { formatDateOnly } from "@/src/utils/date";
import { maskIdNumber, maskNumber } from "@/src/utils/mask";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Surface } from "react-native-paper";
import GatepassCard from "./GatepassCard";
import Section from "./Section";

export default function DetailsTab({
  visitor,
  gp,
  gatepassStatus,
  isVendor,
  type,
}) {
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 250 }}
      style={styles.folioContainer}
    >
      {/* Premium Gatepass Status Card */}
      <View style={styles.statusWrapper}>
        <GatepassCard gp={gp} gatepassStatus={gatepassStatus} />
      </View>

      <View style={styles.infoGrid}>
        {/* --- Employee & Student Schedule Section --- */}
        {(type === "Employee" || type === "Student") && (
          <View>
            <Section
              icon="account-tie-outline"
              label="Purpose of Visit"
              value={visitor?.Purpose}
            />

            <View style={styles.row}>
              <Section
                icon="calendar-month"
                label="Arrival Date"
                value={formatDateOnly(visitor?.FromDate)}
                style={styles.halfWidth}
              />
              <Section
                icon="calendar-check"
                label="Departure"
                value={formatDateOnly(visitor?.ToDate)}
                style={styles.halfWidth}
              />
            </View>

            <View style={styles.row}>
              <Section
                icon="clock-check-outline"
                label="Entry Time"
                value={visitor?.FromTime}
                style={styles.halfWidth}
              />
              <Section
                icon="clock-alert-outline"
                label="Exit Time"
                value={visitor?.ToTime}
                style={styles.halfWidth}
              />
            </View>

            <Section
              icon="comment-text-outline"
              label="Special Notes"
              value={visitor?.Remark}
            />
          </View>
        )}

        {/* --- Security/Visitor Logistics Section --- */}
        {type === "Security" && (
          <View>
            {isVendor && (
              <Section
                icon="domain"
                label="Organization"
                value={visitor?.VisitorCompany}
              />
            )}

            <Section
              icon="map-marker-radius-outline"
              label="Registered Address"
              value={visitor?.VisitorAddress}
            />

            <View style={styles.row}>
              <Section
                icon="phone"
                label="Contact Primary"
                value={maskNumber(visitor?.VisitorContact)}
                style={styles.halfWidth}
              />
            </View>

            <View style={styles.row}>
              <Section
                icon="shield-check-outline"
                label="Validity Period"
                value={visitor?.GatepassValidity}
                style={styles.halfWidth}
              />
            </View>

            <Section
              icon="card-account-details-star-outline"
              label={visitor?.IdProofType || "Identification"}
              value={maskIdNumber(visitor?.IdProofNumber)}
            />

            {visitor?.EmployeeCheckoutTime && (
              <Section
                icon="logout-variant"
                label="Finalized Departure"
                value={visitor?.EmployeeCheckoutTime}
                style={styles.checkoutSection}
              />
            )}

            {visitor?.DocumentUrl && (
              <Surface style={styles.previewContainer} elevation={4}>
                <Image
                  source={{ uri: visitor?.DocumentUrl }}
                  style={styles.docImage}
                  resizeMode="cover"
                />
              </Surface>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  folioContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  statusWrapper: {
    marginBottom: 8,
  },
  infoGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  halfWidth: {
    flex: 1,
  },
  checkoutSection: {
    backgroundColor: "rgba(225, 29, 72, 0.05)", // Subtle red tint for checkout
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  previewContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    height: 180,
    borderWidth: 1,
    borderColor: "#C5A059",
  },
  docImage: { width: "100%", height: "100%" },
});
