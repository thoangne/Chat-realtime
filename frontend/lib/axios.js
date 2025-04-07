import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SOCKET_BASE_URL + "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
