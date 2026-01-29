import { AppDropdown } from "@/components/common/AppDropdown";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text, TextInput } from "react-native-paper";
import MaterialChips from "./MaterialChips";

const GOLD = "#C5A059";

export default function OtherInfoTab({
  control,
  errors,
  VehicleTypeOptions,
  materialOptions,
  handleUpdate,
  hasOtherInfo,
  loading,
}) {
  const [open, setOpen] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 250 }}
      style={styles.tabContent}
    >
      {/* VEHICLE TYPE */}
      <View style={styles.fieldWrapper}>
        <Controller
          control={control}
          name="VehicleType"
          render={({ field }) => (
            <AppDropdown
              label="Transportation Mode"
              placeholder="Select vehicle type..."
              open={open}
              value={field.value}
              items={VehicleTypeOptions}
              setOpen={setOpen}
              setValue={(callback) => {
                const val =
                  typeof callback === "function"
                    ? callback(field.value)
                    : callback;
                field.onChange(val);
              }}
              error={errors.VehicleType?.message}
            />
          )}
        />
      </View>

      {/* VEHICLE NUMBER */}
      <Controller
        control={control}
        name="VehicleNumber"
        render={({ field }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.luxuryLabel}>VEHICLE PLATE NUMBER</Text>
            <TextInput
              mode="flat" // Flat looks more "bespoke" in luxury UIs when colored correctly
              placeholder="e.g. LUX-007"
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={field.value}
              onChangeText={field.onChange}
              style={styles.textInput}
              textColor="#FFF"
              activeUnderlineColor={GOLD}
              underlineColor="rgba(197, 160, 89, 0.3)"
              error={!!errors.VehicleNumber}
            />
          </View>
        )}
      />

      {/* MATERIAL CHIPS (Luggage/Items) */}
      <View style={[styles.inputGroup, { marginTop: 12 }]}>
        <Text style={styles.luxuryLabel}>DEPOSITED ITEMS / LUGGAGE</Text>
        <Controller
          control={control}
          name="Material"
          render={({ field }) => (
            <View style={styles.chipsContainer}>
              <MaterialChips field={field} materialOptions={materialOptions} />
            </View>
          )}
        />
      </View>

      {/* LUXURY ACTION BUTTON */}
      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        style={styles.updateBtn}
        contentStyle={styles.btnContent}
        labelStyle={styles.btnLabel}
      >
        {hasOtherInfo ? "UPDATE REGISTRY" : "SAVE TO LEDGER"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    gap: 28,
  },
  sectionHeader: {
    fontSize: 12,
    color: GOLD,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 4,
    opacity: 0.9,
  },
  fieldWrapper: {
    zIndex: 2000, // Ensure dropdown overlaps
  },
  inputGroup: {
    gap: 8,
  },
  luxuryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1.5,
    marginLeft: 2,
  },
  textInput: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    fontSize: 16,
    height: 48,
  },
  chipsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(197, 160, 89, 0.1)",
  },
  updateBtn: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: GOLD,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnContent: {
    height: 54,
  },
  btnLabel: {
    color: "#1A1A1A",
    fontWeight: "800",
    letterSpacing: 2,
    fontSize: 14,
  },
});
