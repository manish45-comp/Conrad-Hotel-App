import { create } from "zustand";

export type GatePassData = {
  id: string;
  visitorId: string;
  name: string;
  cardNumber: number;
  contact: string;
  visitorCompany: string;
  hostCompany: string;
  toMeet: string;
  purpose: string;
  date: string;
  inTime: string;
  outTime: string;
  photoPath: string;
  qrPath: string;
  logoPath: string;
  watermarkPath: string;
};

type VisitorFormState = {
  // Step 1
  mobile: string;
  visitorId?: number;

  photoUrl?: string;
  photoLocal?: string;

  // Step 2
  name: string;
  address: string;
  company: string;
  idProofType: string;
  idProofId: string;
  idProofNumber: string;
  idProofImage?: string;
  idProofBackImage: string | null;

  // Step 3
  purpose?: string;

  // Step 4
  branchId?: number;
  departmentId?: number;
  employeeId?: number;
  gatePassData?: GatePassData;

  // Actions
  setField: <T extends keyof VisitorFormState>(
    key: T,
    value: VisitorFormState[T],
  ) => void;

  clearVisitorData: () => void;
  reset: () => void;
};

export const useVisitorFormStore = create<VisitorFormState>((set) => ({
  mobile: "",
  name: "",
  address: "",
  company: "",
  idProofType: "",
  idProofNumber: "",
  idProofId: "",
  gatePassData: undefined,
  idProofImage: "",
  idProofBackImage: "",

  cardNumber: null,

  setField: (key, value) => set({ [key]: value } as any),

  clearVisitorData: () =>
    set({
      name: "",
      address: "",
      company: "",
      idProofType: "",
      idProofId: "",
      idProofImage: "",
      idProofBackImage: "",
      idProofNumber: "",
      photoLocal: undefined,
      photoUrl: undefined,
      gatePassData: undefined,
      visitorId: undefined,
      purpose: undefined,
      branchId: undefined,
      departmentId: undefined,
      employeeId: undefined,
    }),

  reset: () =>
    set({
      mobile: "",
      name: "",
      address: "",
      company: "",
      idProofType: "",
      idProofId: "",
      idProofImage: "",
      idProofBackImage: "",
      idProofNumber: "",
      photoLocal: undefined,
      photoUrl: undefined,
      gatePassData: undefined,
      visitorId: undefined,
      purpose: undefined,
      branchId: undefined,
      departmentId: undefined,
      employeeId: undefined,
    }),
}));
