import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const cleanToken = token ? token.replace(/"/g, "") : null;

    if (cleanToken) {
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
