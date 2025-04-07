import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "VITE_SOCKET_BASE_URL/api"
      : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
