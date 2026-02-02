import ConfirmDialog from "@/components/common/ConfirmDialog";
import { StepIndicator } from "@/components/common/StepIndicator";
import { getPurposeList } from "@/src/api/services/visitorSelfRegistration.service";
import { useBackButtonhandler } from "@/src/hooks/useBackButtonhandler";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  MD3Theme,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type PurposeItem = {
  id: number;
  name: string;
};

const Purpose = () => {
  const { onConfirmExit, setShowConfirm, showConfirm } = useBackButtonhandler();
  const { user } = useAuthStore();
  const { setField, purpose } = useVisitorFormStore();
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);

  const [purposeList, setPurposeList] = useState<PurposeItem[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string>(purpose);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchPurposeList = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const result = await getPurposeList();
      setPurposeList(result.data ?? []);
    } catch (err) {
      setError("Failed to load options. Please pull to refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPurposeList();
  }, [user?.UserId]);

  const handleNext = () => {
    if (!selectedPurpose) {
      setError("Please select the purpose of your visit");
      return;
    }
    setField("purpose", selectedPurpose);
    router.push("/visitor-form/whom-to-meet");
  };

  const renderItem = ({ item }: { item: PurposeItem }) => {
    const isSelected = selectedPurpose === item.name;

    return (
      <TouchableRipple
        onPress={() => {
          setSelectedPurpose(item.name);
          setError("");
        }}
        rippleColor="rgba(197, 160, 89, 0.2)"
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}
      >
        <View style={styles.itemRow}>
          <Text
            style={[styles.itemText, isSelected && styles.selectedItemText]}
          >
            {item.name.toUpperCase()}
          </Text>
          {isSelected && (
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#C5A059"
            />
          )}
        </View>
      </TouchableRipple>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <StepIndicator step={4} total={5} title="Visit Intent" />
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

      <View style={styles.headerBox}>
        <Text style={styles.headerSubtitle}>
          Select the primary reason for today's visit.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#C5A059" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={purposeList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                tintColor="#C5A059"
                onRefresh={() => {
                  setRefreshing(true);
                  fetchPurposeList(false);
                }}
              />
            }
          />

          {!!error && (
            <HelperText type="error" style={styles.error}>
              {error}
            </HelperText>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          loading={loading}
          disabled={!selectedPurpose || loading}
          style={styles.nextButton}
          contentStyle={styles.nextButtonContent}
          labelStyle={styles.nextButtonLabel}
        >
          CONTINUE
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Purpose;
export const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 24,
    },

    headerBox: {
      marginBottom: 24,
    },

    headerSubtitle: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
      letterSpacing: 0.5,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    listContent: {
      paddingBottom: 20,
    },

    itemContainer: {
      minHeight: 64,
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
      borderRadius: 4,
    },

    selectedItemContainer: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer,
    },

    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    itemText: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 13,
      letterSpacing: 1.5,
      fontWeight: "500",
    },

    selectedItemText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },

    error: {
      textAlign: "center",
      color: theme.colors.error,
    },

    footer: {
      paddingVertical: 24,
    },

    nextButton: {
      borderRadius: 0,
      backgroundColor: theme.colors.primary,
    },

    nextButtonContent: {
      height: 56,
    },

    nextButtonLabel: {
      color: theme.colors.onPrimary,
      fontWeight: "700",
      letterSpacing: 2,
    },
  });
