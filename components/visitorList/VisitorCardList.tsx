import { VisitorItem } from "@/src/utils/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import VisitorCard from "./VisitorCard";

interface Props {
  visitors: VisitorItem[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  loadingId?: number | null;
  isRejectLoading: boolean;
  isApproveLoading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  actionsVisible: boolean;
}

const VisitorCardList: React.FC<Props> = ({
  visitors,
  onAccept,
  onReject,
  loadingId,
  isRejectLoading,
  isApproveLoading,
  refreshing,
  onRefresh,
  actionsVisible,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: VisitorItem }) => (
      <VisitorCard
        visitor={item}
        isRejectLoading={isRejectLoading}
        isApproveLoading={isApproveLoading}
        onAccept={() => onAccept(item.VisitorId)}
        onReject={() => onReject(item.VisitorId)}
        loading={loadingId === item.VisitorId}
        actionsVisible={actionsVisible}
      />
    ),
    [
      onAccept,
      onReject,
      loadingId,
      actionsVisible,
      isRejectLoading,
      isApproveLoading,
    ],
  );

  // --- PERFORMANCE OPTIMIZATIONS ---
  // Tells FlatList how big the items are so it doesn't have to calculate on the fly
  const getItemLayout = (_: any, index: number) => ({
    length: 180, // Approximate height of your VisitorCard
    offset: 180 * index,
    index,
  });

  // Modern Empty State
  const ListEmptyComponent = () => {
    const theme = useTheme();
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="account-search-outline"
          size={80}
          color={theme.colors.tertiary}
        />
        <Text
          variant="headlineSmall"
          style={[styles.emptyTitle, { color: theme.colors.tertiary }]}
        >
          No Visitors Found
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.emptySubtitle, { color: theme.colors.tertiary }]}
        >
          Records will appear here once visitors are registered.
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={visitors}
      renderItem={renderItem}
      keyExtractor={(item) => item.VisitorId.toString()}
      contentContainerStyle={styles.list}
      // Virtualization Props (Crucial for performance)
      initialNumToRender={10} // Load 10 items initially
      maxToRenderPerBatch={5} // Load 5 items per scroll "chunk"
      windowSize={5} // Keep 5 screens worth of content in memory
      getItemLayout={getItemLayout}
      removeClippedSubviews={true} // Unmount components off-screen
      // UX Props
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default VisitorCardList;

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 100, // Extra space for floating footers
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontWeight: "700",
    marginTop: 16,
  },
  emptySubtitle: {
    textAlign: "center",
    marginTop: 8,
  },
});
