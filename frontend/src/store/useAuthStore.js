import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://chatty-tgbr.onrender.com/api";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],
  setAuthUser: (user) => set({ authUser: user }),
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data, isCheckingAuth: false });
      console.log("checkAuth", response.data);
      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: response.data });
      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error);
    }
  },
  login: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      set({ authUser: response.data });
      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (userData) => {
    set({ isUpdateingProfile: true });
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        userData
      );
      set({ authUser: response.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response.data.message || "Profile update failed");
    } finally {
      set({ isUpdateingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser.user._id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });
    newSocket.on("getOnlineUsers", (userId) => {
      set({ onlineUsers: userId });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect(); // Ngắt kết nối socket
      set({ socket: null }); // Xóa socket khỏi store
      console.log("Socket disconnected");
    }
  },
}));
