import { useVisitorStore } from "../stores/visitor.store";

export const useVisitor = () => ({
  visitor: useVisitorStore((s) => s.visitor),
  loading: useVisitorStore((s) => s.loading),
  error: useVisitorStore((s) => s.error),

  fetchVisitor: useVisitorStore((s) => s.fetchVisitor),
  updateVisitor: useVisitorStore((s) => s.updateVisitor),
  updateVisitorBySecurity: useVisitorStore(
    (s) => s.updateVisitorEntryBySecurity
  ),

  checkIn: useVisitorStore((s) => s.visitorCheckIn),
  checkOut: useVisitorStore((s) => s.visitorCheckOut),

  actionLoading: useVisitorStore((s) => s.actionLoading),
});
