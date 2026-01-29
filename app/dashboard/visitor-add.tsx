import SuccessAlert from "@/components/common/SuccessAlert";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorStore } from "@/src/stores/visitor.store";

import {
  mapIdProofTypes,
  mapVisitorPurpose,
  mapVisitorTypes,
} from "@/src/utils/dropdownMapper";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// ---------------------------------------------------------
// Schema
// ---------------------------------------------------------
const visitorSchema = z
  .object({
    visitorContact: z
      .string()
      .min(10, "Contact must be 10 digits")
      .max(10, "Contact must be 10 digits")
      .regex(/^\d+$/, "Only digits allowed"),
    visitorType: z.string().min(1, "Visitor Type is required"),
    VisitPurpose: z.string().min(1, "Visit Purpose is required"),
    visitorCompany: z.string().optional(),
    visitorName: z.string().min(2, "Name required"),
    visitorAddress: z.string(),
    idProofType: z.string().min(1, "Select ID proof"),
    idProofNumber: z.string().min(1, "Enter ID proof number"),
    visitFrom: z.date().nullable(),
    visitTo: z.date().nullable(),
    inTime: z.date().nullable(),
    outTime: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.visitorType === "Vendor" && !data.visitorCompany) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["visitorCompany"],
        message: "Vendor company name required",
      });
    }
  });

export type VisitorFormValues = z.infer<typeof visitorSchema>;

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

/**
 * Returns a valid Date instance for pickers, with a safe fallback.
 */
const getPickerValue = (value: Date | null | undefined): Date => {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  return new Date();
};

/**
 * Formats a date for display in TextInput.
 */
const formatDateValue = (value: Date | null | undefined): string => {
  if (!(value instanceof Date) || isNaN(value.getTime())) return "";
  return value.toLocaleDateString();
};

/**
 * Formats a time for display in TextInput.
 */
const formatTimeValue = (value: Date | null | undefined): string => {
  if (!(value instanceof Date) || isNaN(value.getTime())) return "";
  return value.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------
const VisitorForm: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();

  const {
    idProofTypeList,
    visitorsTypeList,
    visitorsPurposeList,
    visitorAddEntry,
    actionLoading,
    loading,
    getVisitorTypeList,
    getVisitorPurposeList,
    getIdProofList,
  } = useVisitorStore();

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);

  // Track mount state to avoid setting state on unmounted component
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch dropdown data once
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        await Promise.all([
          getVisitorPurposeList(),
          getVisitorTypeList(),
          getIdProofList(),
        ]);
      } catch (err) {
        console.log("Dropdown Load Error:", err);
      }
    };

    fetchDropdowns();
  }, [getIdProofList, getVisitorPurposeList, getVisitorTypeList]);

  // Memoized dropdown options
  const visitorTypeOptions = useMemo(
    () => mapVisitorTypes(visitorsTypeList || []),
    [visitorsTypeList]
  );

  const visitorPurposeOptions = useMemo(
    () => mapVisitorPurpose(visitorsPurposeList || []),
    [visitorsPurposeList]
  );

  const idProofTypeOptions = useMemo(
    () => mapIdProofTypes(idProofTypeList || []),
    [idProofTypeList]
  );

  const now = new Date();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      visitorContact: "",
      visitorType: "",
      VisitPurpose: "",
      visitorCompany: "",
      visitorName: "",
      visitorAddress: "",
      idProofType: "",
      idProofNumber: "",
      visitFrom: now,
      visitTo: now,
      inTime: now,
      outTime: now,
    },
  });

  const visitorType = watch("visitorType");

  // Auto-clear company for non-vendor
  useEffect(() => {
    if (visitorType !== "Vendor") {
      setValue("visitorCompany", "");
    }
  }, [visitorType, setValue]);

  useEffect(() => {
    if (!visitorsTypeList.length) return;

    const now = new Date();
    reset({
      ...watch(),
      visitFrom: now,
      visitTo: now,
      inTime: now,
      outTime: now,
    });
  }, [visitorsTypeList]);

  // Generic DateTimePicker change handler
  const handleDateChange =
    (
      fieldName: keyof VisitorFormValues,
      closePicker: (visible: boolean) => void
    ) =>
    (_event: DateTimePickerEvent, selectedDate?: Date) => {
      // Android auto closes on selection
      if (Platform.OS !== "ios") {
        try {
          closePicker(false);
        } catch (e) {
          // In rare race conditions, setter may be invalid; ignore safely
          console.log("Picker close error:", e);
        }
      }

      if (
        selectedDate &&
        selectedDate instanceof Date &&
        !isNaN(selectedDate.getTime())
      ) {
        setValue(fieldName, selectedDate);
      }
    };

  // ---------------------------------------------------------
  // Submit Handler
  // ---------------------------------------------------------
  const onSubmit = useCallback(
    async (formData: VisitorFormValues) => {
      try {
        const ok = await visitorAddEntry({
          data: formData,
          loginUserId: user?.UserId ?? 0,
        });

        if (!isMountedRef.current) return;

        if (!ok) {
          const storeState = useVisitorStore.getState() as {
            error?: string | null;
          };
          const errorMessage =
            storeState.error ?? "Unable to add visitor. Please try again.";
          setSuccessMsg(errorMessage);
          setSuccessVisible(true);
          return;
        }

        setSuccessMsg("Visitor added successfully");
        setSuccessVisible(true);

        // Small delay for user to see message
        setTimeout(() => {
          if (isMountedRef.current) {
            router.replace("/dashboard/visitor-list");
          }
        }, 1400);
      } catch (err: any) {
        if (!isMountedRef.current) return;
        console.log("Visitor Add Error:", err);

        const message =
          err?.response?.data?.Message ||
          err?.message ||
          "Something went wrong. Please try again.";
        setSuccessMsg(message);
        setSuccessVisible(true);
      }
    },
    [user?.UserId, visitorAddEntry]
  );

  // ---------------------------------------------------------
  // Loading UI
  // ---------------------------------------------------------
  if (actionLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 50,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------------- CONTACT ---------------- */}
        <Controller
          control={control}
          name="visitorContact"
          render={({ field }) => (
            <TextInput
              label="Visitor Contact*"
              keyboardType="numeric"
              mode="outlined"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.visitorContact}
              style={{
                backgroundColor: theme.colors.elevation.level1,
              }}
              outlineStyle={{ borderRadius: 12 }}
            />
          )}
        />

        {/* ---------------- VISITOR TYPE ---------------- */}
        <Controller
          control={control}
          name="visitorType"
          render={({ field }) => (
            <Dropdown
              label="Visitor Type*"
              mode="outlined"
              value={field.value}
              onSelect={field.onChange}
              options={visitorTypeOptions}
              error={!!errors.visitorType}
              CustomDropdownInput={({
                label,
                selectedLabel,
                rightIcon,
                mode,
              }) => (
                <TextInput
                  label={label}
                  value={selectedLabel ?? ""}
                  editable={false}
                  mode={mode}
                  right={rightIcon}
                  outlineStyle={{ borderRadius: 12 }}
                  style={{ backgroundColor: theme.colors.elevation.level1 }}
                />
              )}
            />
          )}
        />

        {/* ---------------- NAME ---------------- */}
        <Controller
          control={control}
          name="visitorName"
          render={({ field }) => (
            <TextInput
              label="Visitor Name*"
              mode="outlined"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.visitorName}
              outlineStyle={{ borderRadius: 12 }}
              style={{ backgroundColor: theme.colors.elevation.level1 }}
            />
          )}
        />

        {/* ---------------- ADDRESS ---------------- */}
        <Controller
          control={control}
          name="visitorAddress"
          render={({ field }) => (
            <TextInput
              label="Visitor Address*"
              mode="outlined"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.visitorAddress}
              outlineStyle={{ borderRadius: 12 }}
              style={{ backgroundColor: theme.colors.elevation.level1 }}
            />
          )}
        />

        {/* ---------------- COMPANY (Vendor ONLY) ---------------- */}
        {visitorType === "Vendor" && (
          <Controller
            control={control}
            name="visitorCompany"
            render={({ field }) => (
              <TextInput
                label="Visitor Company*"
                mode="outlined"
                value={field.value ?? ""}
                onChangeText={field.onChange}
                error={!!errors.visitorCompany}
                outlineStyle={{ borderRadius: 12 }}
                style={{ backgroundColor: theme.colors.elevation.level1 }}
              />
            )}
          />
        )}

        {/* ---------------- ID PROOF TYPE ---------------- */}
        <Controller
          control={control}
          name="idProofType"
          render={({ field }) => (
            <Dropdown
              label="ID Proof Type*"
              mode="outlined"
              value={field.value}
              onSelect={field.onChange}
              options={idProofTypeOptions}
              error={!!errors.idProofType}
              CustomDropdownInput={({
                label,
                selectedLabel,
                rightIcon,
                mode,
              }) => (
                <TextInput
                  label={label}
                  value={selectedLabel ?? ""}
                  editable={false}
                  mode={mode}
                  right={rightIcon}
                  outlineStyle={{ borderRadius: 12 }}
                  style={{ backgroundColor: theme.colors.elevation.level1 }}
                />
              )}
            />
          )}
        />

        {/* ---------------- ID PROOF NUMBER ---------------- */}
        <Controller
          control={control}
          name="idProofNumber"
          render={({ field }) => (
            <TextInput
              label="ID Proof Number*"
              mode="outlined"
              value={field.value}
              onChangeText={field.onChange}
              error={!!errors.idProofNumber}
              outlineStyle={{ borderRadius: 12 }}
              style={{ backgroundColor: theme.colors.elevation.level1 }}
            />
          )}
        />

        {/* ---------------- PURPOSE ---------------- */}
        <Controller
          control={control}
          name="VisitPurpose"
          render={({ field }) => (
            <Dropdown
              label="Visit Purpose*"
              mode="outlined"
              value={field.value}
              onSelect={field.onChange}
              options={visitorPurposeOptions}
              error={!!errors.VisitPurpose}
              CustomDropdownInput={({
                label,
                selectedLabel,
                rightIcon,
                mode,
              }) => (
                <TextInput
                  label={label}
                  value={selectedLabel ?? ""}
                  editable={false}
                  mode={mode}
                  right={rightIcon}
                  outlineStyle={{ borderRadius: 12 }}
                  style={{ backgroundColor: theme.colors.elevation.level1 }}
                />
              )}
            />
          )}
        />

        {/* ---------------- DATE PICKERS ---------------- */}
        <TextInput
          label="Visit From*"
          value={formatDateValue(watch("visitFrom"))}
          mode="outlined"
          editable={false}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => setShowFromPicker(true)}
            />
          }
          outlineStyle={{ borderRadius: 12 }}
          style={{ backgroundColor: theme.colors.elevation.level1 }}
        />

        {showFromPicker && (
          <DateTimePicker
            mode="date"
            value={getPickerValue(watch("visitFrom"))}
            onChange={handleDateChange("visitFrom", setShowFromPicker)}
          />
        )}

        <TextInput
          label="Visit To*"
          value={formatDateValue(watch("visitTo"))}
          mode="outlined"
          editable={false}
          right={
            <TextInput.Icon
              icon="calendar"
              onPress={() => setShowToPicker(true)}
            />
          }
          outlineStyle={{ borderRadius: 12 }}
          style={{ backgroundColor: theme.colors.elevation.level1 }}
        />

        {showToPicker && (
          <DateTimePicker
            mode="date"
            value={getPickerValue(watch("visitTo"))}
            onChange={handleDateChange("visitTo", setShowToPicker)}
          />
        )}

        {/* ---------------- TIME PICKERS ---------------- */}
        <TextInput
          label="In Time"
          value={formatTimeValue(watch("inTime"))}
          mode="outlined"
          editable={false}
          right={
            <TextInput.Icon
              icon="clock-outline"
              onPress={() => setShowInPicker(true)}
            />
          }
          outlineStyle={{ borderRadius: 12 }}
          style={{ backgroundColor: theme.colors.elevation.level1 }}
        />

        {showInPicker && (
          <DateTimePicker
            mode="time"
            value={getPickerValue(watch("inTime"))}
            onChange={handleDateChange("inTime", setShowInPicker)}
            is24Hour={true}
          />
        )}

        <TextInput
          label="Out Time"
          value={formatTimeValue(watch("outTime"))}
          mode="outlined"
          editable={false}
          right={
            <TextInput.Icon
              icon="clock-outline"
              onPress={() => setShowOutPicker(true)}
            />
          }
          outlineStyle={{ borderRadius: 12 }}
          style={{ backgroundColor: theme.colors.elevation.level1 }}
        />

        {showOutPicker && (
          <DateTimePicker
            mode="time"
            value={getPickerValue(watch("outTime"))}
            onChange={handleDateChange("outTime", setShowOutPicker)}
            is24Hour={true}
          />
        )}

        {/* ---------------- SUBMIT ---------------- */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={actionLoading || loading}
          disabled={actionLoading || loading}
          style={{ borderRadius: 12, marginTop: 6 }}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: 16, fontWeight: "600" }}
        >
          Submit
        </Button>
      </ScrollView>

      <SuccessAlert
        visible={successVisible}
        message={successMsg}
        onDismiss={() => setSuccessVisible(false)}
      />
    </SafeAreaView>
  );
};

export default VisitorForm;
