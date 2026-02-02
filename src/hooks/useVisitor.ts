import { useVisitorStore } from "../stores/visitor.store";

export const useVisitor = () => ({
  visitor: useVisitorStore((s) => s.visitor),
  loading: useVisitorStore((s) => s.loading),
  profileUpdateLoading : useVisitorStore((s)=>s.profileUpdateLoading),
  error: useVisitorStore((s) => s.error),

  fetchVisitor: useVisitorStore((s) => s.fetchVisitor),
  updateVisitor: useVisitorStore((s) => s.updateVisitor),
  updateVisitorBySecurity: useVisitorStore(
    (s) => s.updateVisitorEntryBySecurity,
  ),
  actionLoading: useVisitorStore((s) => s.actionLoading),
  resetVisitor: useVisitorStore((s) => s.resetVisitor),
});
