import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 16, borderRadius: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 24,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  statusBadgeWrapper: { position: "absolute", right: -5, top: -8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  gatepassContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  gatepassIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  materialChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  materialChip: { borderRadius: 20 },
  tabView: { height: 470, borderRadius: 10 },
});
