import { formatDate, formatTime } from "@/src/utils/dropdownMapper";
import axios from "axios";

import Constants from "expo-constants";
const { API_BASE_URL } = Constants.expoConfig?.extra;

export const apiGetVisitorDetails = async (id: string) => {
  if (!id) {
    throw new Error("Invalid ID");
  }
  const endpoint = `${API_BASE_URL}/Visitor/GetVisitorDetails/${id}`;
  try {
    const response = await axios.get(endpoint, {
      validateStatus: (status) => status >= 200 && status < 500,
    });
    return response.data;
  } catch (error) {
    console.log("apiGetVisitorDetails error:", error);
    throw error;
  }
};

export const apiVisitorCheckIn = async (
  QRCodeId: string,
  UserId: number,
  UserRole: string,
) => {
  const url = `${API_BASE_URL}/Visitor/VisitorCheckIn`;
  return await axios
    .post(
      url,
      {
        QRCodeId,
        UserId,
        UserRole,
      },
      {
        validateStatus: () => true,
      },
    )
    .then((res) => {
      return res.data;
    });
};

export const apiVisitorCheckOut = async (
  QRCodeId: string,
  UserId: number,
  UserRole: string,
) => {
  const url = `${API_BASE_URL}/Visitor/VisitorCheckOut`;
  return await axios
    .post(
      url,
      {
        QRCodeId,
        UserId,
        UserRole,
      },
      {
        validateStatus: () => true,
      },
    )
    .then((res) => res.data);
};

export const apiUpdateVisitorDetails = async (
  VisitorId: number,
  ImageString: string,
) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/Visitor/AddVisitorPhoto`, {
      VisitorId,
      ImageString,
    });

    return res.data; // <<< FINALLY RETURN PROPERLY
  } catch (err) {
    console.error("Update visitor error:", err);
    return { StatusCode: 500, Message: "Update failed", Data: null };
  }
};

export const apiAddVisitorEntry = async ({ data, loginUserId }) => {
  try {
    const payload = {
      VisitorId: 0,
      LoginUserId: loginUserId,
      ContactNumber: data.visitorContact,
      VisitorType: data.visitorType,
      VisitPurpose: data.VisitPurpose,
      VisitorCompany: data.visitorCompany,
      VisitorName: data.visitorName,
      VisitorAddress: data.visitorAddress,
      IdProofType: data.idProofType,
      IdProofNumber: data.idProofNumber,
      FromDate: formatDate(data.visitFrom),
      ToDate: formatDate(data.visitTo),
      InTime: formatTime(data.inTime),
      OutTime: formatTime(data.outTime),
    };

    const res = await axios.post(
      `${API_BASE_URL}/Visitor/SaveVisitor`,
      payload,
    );

    return res.data;
  } catch (err) {
    console.error("Add visitor error:", err);
    return { StatusCode: 500, Message: "Failed", Data: null };
  }
};

export const apiGetVisitorsList = async (
  id: number,
  fromDate: string,
  toDate: string,
) =>
  await axios
    .post(
      `${API_BASE_URL}/Visitor/GetVisitorList`,
      {
        LoginUserId: id,
        Fromdate: fromDate,
        Todate: toDate,
      },
      {
        validateStatus: () => true,
      },
    )
    .then((res) => {
      return res.data;
    });

export const apiGetVisitorTypeList = async () =>
  await axios
    .get(`${API_BASE_URL}/Visitor/GetVisitortypeList`, {
      validateStatus: () => true,
    })
    .then((res) => {
      return res.data;
    });

export const apiGetVisitorPurposeList = async () =>
  await axios
    .get(`${API_BASE_URL}/Visitor/GetVisitorpurposeList`, {
      validateStatus: () => true,
    })
    .then((res) => {
      return res.data;
    });

export const apiGetIdProofTypesList = async () =>
  await axios
    .get(`${API_BASE_URL}/Visitor/GetIdprooftypeList`, {
      // change to new api to get get id proof type
      validateStatus: () => true,
    })
    .then((res) => {
      return res.data;
    });

export const apiGetVehicleTypesList = async () =>
  await axios
    .get(`${API_BASE_URL}/Visitor/GetVehicletypeList`, {
      // change to new api get vehicle type
      validateStatus: () => true,
    })
    .then((res) => {
      return res.data;
    });

export const apiUpdateVisitorEntryBySecurity = async (
  VisitorId: number,
  VehicleType: string,
  VehicleNumber: string,
  Material: string,
) =>
  await axios
    .post(
      `${API_BASE_URL}/Visitor/UpdateVisitorEntryBySecurity`,
      {
        VisitorId,
        VehicleType,
        VehicleNumber,
        Material,
      },
      {
        validateStatus: () => true,
      },
    )
    .then((res) => {
      return res.data;
    });

export const apiApproveVisitorByAdmin = async (
  VisitorId: number,
  LoginUserId: number,
) => {
  const res = await axios.post(
    `${API_BASE_URL}/Visitor/VisitorApproveByAdmin`,
    null, // 👈 no body
    {
      params: {
        VisitorId,
        LoginUserId,
      },
      validateStatus: () => true,
    },
  );

  return res.data;
};

export const apiRejectVisitorByAdmin = async (
  VisitorId: number,
  LoginUserId: number,
) => {
  const res = await axios.post(
    `${API_BASE_URL}/Visitor/VisitorRejectByAdmin`,
    null, // 👈 no body
    {
      params: {
        VisitorId,
        LoginUserId,
      },
      validateStatus: () => true,
    },
  );

  return res.data;
};
