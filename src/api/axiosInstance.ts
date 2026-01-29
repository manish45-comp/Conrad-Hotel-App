import axios from "axios";
import Constants from "expo-constants";

const { API_BASE_URL } = Constants.expoConfig?.extra;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("API Error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
