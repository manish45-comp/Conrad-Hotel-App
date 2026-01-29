import axios from "axios";

import Constants from "expo-constants";
const { API_BASE_URL } = Constants.expoConfig?.extra;

export const authService = {
  login: async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/Login/Login`, {
      Username: username,
      Password: password,
    });
    return response.data; // { StatusCode, Message, Data }
  },
};
