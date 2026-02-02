import { StepIndicator } from "@/components/common/StepIndicator";
import {
  getBranchList,
  getDepartmentList,
  getEmployeeList,
  postVisitorEntry,
} from "@/src/api/services/visitorSelfRegistration.service";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StatusBar, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppDropdown } from "@/components/common/AppDropdown";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useBackButtonhandler } from "@/src/hooks/useBackButtonhandler";

type Item = {
  id: string;
  name: string;
};

const WhomToMeet = () => {
  const { onConfirmExit, setShowConfirm, showConfirm } = useBackButtonhandler();

  const [branch, setBranch] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [employee, setEmployee] = useState<string | null>(null);

  const [BranchList, setBranchList] = useState<Item[]>([]);
  const [DepartmentList, setDepartmentList] = useState<Item[]>([]);
  const [EmployeeList, setEmployeeList] = useState<Item[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [branchOpen, setBranchOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);

  const {
    address,
    company,
    idProofNumber,
    idProofType,
    mobile,
    name,
    photoUrl,
    purpose,
    idProofImage,
    setField,
  } = useVisitorFormStore();

  // ---------------- FETCH DATA ----------------

  // branch list (initial)
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setFetchingData(true);

        const res = await getBranchList();
        const list = res ?? [];

        setBranchList(list);

        if (list.length) {
          setBranch(list[0].id);
        }
      } catch (e) {
        console.log("Failed to fetch branches", e);
      } finally {
        setFetchingData(false);
      }
    };

    fetchBranches();
  }, []);

  // departments + employees when branch changes
  useEffect(() => {
    if (!branch) {
      setDepartmentList([]);
      setEmployeeList([]);
      setDepartment(null);
      setEmployee(null);
      return;
    }

    const fetchOnBranchChange = async () => {
      try {
        // fetch departments
        const deptRes = await getDepartmentList(branch);
        setDepartmentList(deptRes ?? []);

        // fetch employees by branch (department = null)
        const empRes = await getEmployeeList(null, branch);
        setEmployeeList(empRes ?? []);

        setDepartment(null);
        setEmployee(null);
      } catch (e) {
        console.log("Failed to load branch data", e);
      }
    };

    fetchOnBranchChange();
  }, [branch]);

  // employees by branch when department is NOT selected
  useEffect(() => {
    if (!branch || department) return;

    const fetchEmployeesByBranch = async () => {
      try {
        const res = await getEmployeeList(null, branch);
        setEmployeeList(res ?? []);
      } catch (e) {
        console.log("Failed to fetch employees by branch", e);
      }
    };

    fetchEmployeesByBranch();
  }, [branch, department]);

  // employees when department changes
  useEffect(() => {
    if (!department) {
      setEmployeeList([]);
      setEmployee(null);
      return;
    }

    const fetchEmployees = async () => {
      try {
        const res = await getEmployeeList(department, null);
        setEmployeeList(res ?? []);
      } catch (e) {
        console.log("Failed to fetch employees", e);
      }
    };

    fetchEmployees();
  }, [department]);

  // ---------------- MEMOIZED LISTS ----------------
  const dropdownBranchList = useMemo(
    () => BranchList.map((item) => ({ label: item.name, value: item.id })),
    [BranchList],
  );

  const dropdownDepartmentList = useMemo(
    () => DepartmentList.map((item) => ({ label: item.name, value: item.id })),
    [DepartmentList],
  );

  const dropdownEmployeeList = useMemo(
    () => EmployeeList.map((item) => ({ label: item.name, value: item.id })),
    [EmployeeList],
  );

  // ---------------- ACTIONS ----------------

  const validate = () => {
    const e: Record<string, string> = {};
    if (!branch) e.branch = "Location required";
    if (!employee) e.employee = "Host selection required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    const data = {
      Contact: mobile,
      Name: name,
      Company: company,
      Address: address,
      Purpose: purpose,
      toMeet: employee,
      BranchId: branch,
      DepartmentId: department,
      EmployeeId: employee,
      IdProof: idProofType,
      IdProofNumber: idProofNumber,
      Photo: photoUrl,
      DocumentImage: idProofImage,
    };

    try {
      const res = await postVisitorEntry(data);
      setField("gatePassData", res?.data);
      router.push("/visitor-form/gatepass");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <StepIndicator step={5} total={5} title="Finalize Visit" />
      <ConfirmDialog
        visible={showConfirm}
        message="Are you want go back to home?"
        confirmText="Ok"
        cancelText="Cancel"
        onConfirm={onConfirmExit}
        onCancel={() => setShowConfirm(false)}
        isApproveLoading={false}
        isRejectLoading={false}
      />

      <View style={styles.body}>
        <Text style={styles.instructionText}>APPOINTMENT DETAILS</Text>

        <View style={styles.card}>
          <AppDropdown
            label="Branch Location"
            open={branchOpen}
            setOpen={setBranchOpen}
            items={dropdownBranchList}
            value={branch}
            setValue={setBranch}
            error={errors.branch}
            placeholder="Select Office"
          />

          <AppDropdown
            label="Department"
            open={departmentOpen}
            setOpen={setDepartmentOpen}
            items={dropdownDepartmentList}
            value={department}
            setValue={setDepartment}
            disabled={!branch}
            error={errors.department}
            placeholder="Select Department"
          />

          <AppDropdown
            label="Host / Person to Meet"
            open={employeeOpen}
            setOpen={setEmployeeOpen}
            items={dropdownEmployeeList}
            value={employee}
            setValue={setEmployee}
            searchable
            error={errors.employee}
            placeholder="Search Host Name"
          />
        </View>

        <Text style={styles.disclaimer}>
          Your host will be notified immediately upon submission.
        </Text>

        {fetchingData && (
          <ActivityIndicator color="#C5A059" style={{ marginTop: 20 }} />
        )}
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!branch || !employee || loading}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          COMPLETE REGISTRATION
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default WhomToMeet;
export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
    },

    body: {
      flex: 1,
      paddingVertical: 32,
    },

    instructionText: {
      color: theme.colors.primary,
      fontSize: 11,
      letterSpacing: 2,
      fontWeight: "700",
      marginBottom: 20,
      textAlign: "center",
    },

    card: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      zIndex: 1000,
    },

    disclaimer: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      textAlign: "center",
      marginTop: 24,
      fontStyle: "italic",
    },

    footer: {
      paddingBottom: 32,
    },

    submitButton: {
      borderRadius: 0,
    },

    buttonContent: {
      height: 58,
    },

    buttonLabel: {
      color: theme.colors.onPrimary,
      fontWeight: "800",
      letterSpacing: 1.5,
    },
  });
