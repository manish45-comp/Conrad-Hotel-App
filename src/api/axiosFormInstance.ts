import axios from "axios";

const axiosFormInstance = axios.create({
  baseURL: "http://208.109.231.145:6767/",
  timeout: 2000,
});

axiosFormInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("API Error:", error);
    return Promise.reject(error);
  },
);

export default axiosFormInstance;
