import axios from "axios";
import Constants from "expo-constants";
const { API_SELF_REGISTER } = Constants.expoConfig?.extra;

export type VisitorResponse = {
  success: boolean;
  data?: {
    visitorId: number;
    name: string;
    visitorCompany: string;
    address: string;
    imageUrl: string;
    idProof: string;
    idProofNo: string;
    idProofId: string;
    purpose: string;
  };
};

export async function getVisitorByMobile(mobile: string) {
  const res = await axios.get<VisitorResponse>(
    `${API_SELF_REGISTER}/GetVisitorByMobile`,
    { params: { mobile } },
  );
  return res.data;
}

export async function getIdProofTypes() {
  const res = await axios.get(`${API_SELF_REGISTER}/GetIdProofTypeList`);
  return res.data;
}

export async function getPurposeList() {
  const res = await axios.get(`${API_SELF_REGISTER}/GetVisitorPurposeList`);
  return res.data;
}

export async function getBranchList() {
  const res = await axios.get(`${API_SELF_REGISTER}/GetBranchList`);
  return res.data;
}

export async function getDepartmentList(branchId: string) {
  const res = await axios.get(`${API_SELF_REGISTER}/GetDepartmentList`, {
    params: { branchId },
  });
  return res.data;
}

export async function getEmployeeList(departmentId: string, branchId: string) {
  const res = await axios.get(`${API_SELF_REGISTER}/GetEmployeeList`, {
    params: { departmentId, branchId },
  });
  return res.data;
}

export async function postVisitorEntry(data) {
  const res = await axios.post(
    `${API_SELF_REGISTER}/SaveSelfVisitorEntry`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}
