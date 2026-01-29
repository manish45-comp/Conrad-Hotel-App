import { create } from "zustand";
import {
  apiAddVisitorEntry,
  apiApproveVisitorByAdmin,
  apiGetIdProofTypesList,
  apiGetVehicleTypesList,
  apiGetVisitorDetails,
  apiGetVisitorPurposeList,
  apiGetVisitorsList,
  apiGetVisitorTypeList,
  apiRejectVisitorByAdmin,
  apiUpdateVisitorDetails,
  apiUpdateVisitorEntryBySecurity,
} from "../api/services/visitor.service";

// -------------------------
// Types
// -------------------------

export interface Visitor {
  VisitorId: number;
  VisitorType: string | null;
  VisitorName: string;
  ImageUrl: string | null;
  VisitorContact: string;
  VisitorCompany: string;
  VisitorAddress: string;
  IdProofType: string;
  IdProofNumber: string;
  VisiteeName: string;
  VisiteeId: number;
  GatepassStatus: string;
  GatepassValidity: string;
  VisitorStatus: string;
  IsEmployeeCheckout: boolean;
  EmployeeCheckoutTime: string;
  VehicleType: string;
  VehicleNumber: string;
  Material: string;
  InOutStatus: string;
  FromDate: string;
  ToDate: string;
}

export interface ApiResponse<T> {
  StatusCode: number;
  Message: string;
  Data: T | null;
}

interface AddVisitorEntryParams {
  data: any;
  loginUserId: number;
}

export interface VisitorStoreState {
  visitor: Visitor | null;
  visitorsList: Visitor[];
  visitorsTypeList: any[];
  visitorsPurposeList: any[];
  idProofTypeList: any[];
  vehicleTypeList: any[];

  loading: boolean; // used for screen-level fetches
  actionLoading: boolean; // used for form submit/update actions
  isApproveLoading: boolean;
  isRejectLoading: boolean;

  actionVisitorId: number;
  error: string | null;

  fetchVisitor: (id: string) => Promise<void>;
  updateVisitor: (
    QRCodeId: string,
    id: number,
    base64: string,
  ) => Promise<boolean>;

  visitorAddEntry: (params: AddVisitorEntryParams) => Promise<boolean>;

  getVisitorList: (
    userId: number,
    fromDate: string,
    toDate: string,
  ) => Promise<void>;

  getVisitorTypeList: () => Promise<void>;
  getVisitorPurposeList: () => Promise<void>;
  getIdProofList: () => Promise<void>;
  getVehicleTypes: () => Promise<void>;

  updateVisitorEntryBySecurity: (
    VisitorId: number,
    VehicleType: string,
    VehicleNumber: string,
    Material: string,
  ) => Promise<boolean>;

  ApproveVisitorByAdmin: (
    VisitorId: number,
    LoginUserId: number,
  ) => Promise<boolean>;

  RejectVisitorByAdmin: (
    VisitorId: number,
    LoginUserId: number,
  ) => Promise<boolean>;
}

// -------------------------
// Zustand Store
// -------------------------

export const useVisitorStore = create<VisitorStoreState>((set, get) => ({
  visitor: null,
  visitorsList: [],
  visitorsPurposeList: [],
  visitorsTypeList: [],

  idProofTypeList: [],
  vehicleTypeList: [],

  loading: false,
  actionLoading: false,

  isApproveLoading: false,
  isRejectLoading: false,

  actionVisitorId: null,
  error: null,

  /**
   * Fetch visitor details by QR code ID
   */
  fetchVisitor: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res: ApiResponse<Visitor> = await apiGetVisitorDetails(id);

      if (res.StatusCode !== 200 || !res.Data) {
        set({
          loading: false,
          visitor: null,
          error: res.Message ?? "Visitor not found",
        });
        return;
      }

      set({ visitor: res.Data, loading: false, error: null });
    } catch (err) {
      set({
        loading: false,
        visitor: null,
        error: "Something went wrong",
      });
    }
  },

  /**
   * Upload captured image (base64) and update visitor details
   */
  updateVisitor: async (QRCodeId, VisitorId, base64) => {
    set({ actionLoading: true, error: null });

    try {
      const res = await apiUpdateVisitorDetails(VisitorId, base64);

      if (!res || res.StatusCode !== 200) {
        set({
          actionLoading: false,
          error: res?.Message ?? "Update failed",
        });
        return false;
      }

      // Refresh visitor data
      await get().fetchVisitor(QRCodeId);

      set({ actionLoading: false });
      return true;
    } catch (err) {
      set({
        actionLoading: false,
        error: "Something went wrong",
      });
      return false;
    }
  },

  /**
   * Add a new visitor entry
   */
  visitorAddEntry: async ({ data, loginUserId }) => {
    set({ actionLoading: true, error: null });

    try {
      const res = await apiAddVisitorEntry({ data, loginUserId });

      if (!res || res.StatusCode !== 200) {
        set({
          actionLoading: false,
          error: res?.Message ?? "Failed to add visitor",
        });
        return false;
      }

      set({ actionLoading: false });
      return true;
    } catch {
      set({
        actionLoading: false,
        error: "Failed to add visitor",
      });
      return false;
    }
  },

  /**
   * Fetch list of all visitors for dashboard filters
   */
  getVisitorList: async (userId, fromDate, toDate) => {
    set({ loading: true, error: null });

    try {
      const res = await apiGetVisitorsList(userId, fromDate, toDate);
      if (res.StatusCode !== 200) {
        set({
          loading: false,
          visitorsList: [],
          error: res.Message ?? "Failed to fetch visitors",
        });
        return;
      }

      set({
        visitorsList: res.Data ?? [],
        loading: false,
      });
    } catch {
      set({
        loading: false,
        visitorsList: [],
        error: "Something went wrong",
      });
    }
  },

  /**
   * Fetch dropdown: Visitor Type List
   */
  getVisitorTypeList: async () => {
    set({ loading: true, error: null });

    try {
      const res: ApiResponse<any[]> = await apiGetVisitorTypeList();

      if (res.StatusCode !== 200 || !res.Data) {
        set({
          loading: false,
          error: res.Message ?? "Failed to fetch visitor types",
        });
        return;
      }

      set({
        visitorsTypeList: res.Data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Something went wrong",
      });
    }
  },

  /**
   * Fetch dropdown: Visitor Purpose List
   */
  getVisitorPurposeList: async () => {
    set({ loading: true, error: null });

    try {
      const res: ApiResponse<any[]> = await apiGetVisitorPurposeList();

      if (res.StatusCode !== 200 || !res.Data) {
        set({
          loading: false,
          error: res.Message ?? "Failed to fetch visitor purposes",
        });
        return;
      }

      set({
        visitorsPurposeList: res.Data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Something went wrong",
      });
    }
  },

  getIdProofList: async () => {
    set({ loading: true, error: null });

    try {
      const res: ApiResponse<any[]> = await apiGetIdProofTypesList();

      if (res.StatusCode !== 200 || !res.Data) {
        set({
          loading: false,
          error: res.Message ?? "Failed to fetch id proof",
        });
        return;
      }

      set({
        idProofTypeList: res.Data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Something went wrong",
      });
    }
  },

  getVehicleTypes: async () => {
    set({ loading: true, error: null });

    try {
      const res: ApiResponse<any[]> = await apiGetVehicleTypesList();

      if (res.StatusCode !== 200 || !res.Data) {
        set({
          loading: false,
          error: res.Message ?? "Failed to fetch Vehicle type",
        });
        return;
      }

      set({
        vehicleTypeList: res.Data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
        error: "Something went wrong",
      });
    }
  },

  /**
   * Security Guard — Add/Update Vehicle & Material Info
   */
  updateVisitorEntryBySecurity: async (
    VisitorId,
    VehicleType,
    VehicleNumber,
    Material,
  ) => {
    set({ actionLoading: true, error: null });

    try {
      const res = await apiUpdateVisitorEntryBySecurity(
        VisitorId,
        VehicleType,
        VehicleNumber,
        Material,
      );

      if (res.StatusCode !== 200) {
        set({
          actionLoading: false,
          error: res.Message ?? "Update failed",
        });
        return false;
      }

      set({ actionLoading: false });
      return true;
    } catch {
      set({
        actionLoading: false,
        error: "Update failed",
      });
      return false;
    }
  },

  ApproveVisitorByAdmin: async (VisitorId, LoginUserId) => {
    set({ isApproveLoading: true, actionVisitorId: VisitorId, error: null });

    try {
      const res = await apiApproveVisitorByAdmin(VisitorId, LoginUserId);
      console.log(res);

      if (!res.Status) {
        set({
          isApproveLoading: false,
          actionVisitorId: null,
          error: res.Message ?? "Update failed",
        });
        return false;
      }

      set({ isApproveLoading: false, actionVisitorId: null });
      return true;
    } catch {
      set({
        isApproveLoading: false,
        actionVisitorId: null,
        error: "Update failed",
      });
      return false;
    }
  },

  RejectVisitorByAdmin: async (VisitorId, LoginUserId) => {
    set({ isRejectLoading: true, actionVisitorId: VisitorId, error: null });

    try {
      const res = await apiRejectVisitorByAdmin(VisitorId, LoginUserId);

      if (!res.Status) {
        set({
          isRejectLoading: false,
          actionVisitorId: null,
          error: res.Message ?? "Update failed",
        });
        return false;
      }

      set({ isRejectLoading: false, actionVisitorId: null });
      return true;
    } catch {
      set({
        isRejectLoading: false,
        actionVisitorId: null,
        error: "Update failed",
      });
      return false;
    }
  },
}));
