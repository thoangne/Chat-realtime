import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;

export const useAuthStore = create((set, get) => ({
  authUser: JSON.parse(localStorage.getItem("authUser")) || null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],

  setAuthUser: (user) => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
    set({ authUser: user });
  },

  checkAuth: async () => {
    const { connectSocket } = get();
    try {
      console.log("👉 Checking authentication...");
      const response = await axiosInstance.get("/auth/check");
      console.log("👉 Response from server:", response.data);

      if (response.data && response.data._id) {
        set({ authUser: response.data, isCheckingAuth: false });
        connectSocket();
      } else {
        console.log("👉 No user data found, clearing authUser");
        set({ authUser: null, isCheckingAuth: false });
      }
    } catch (error) {
      console.error("Error checking auth:", error);

      const authUser = JSON.parse(localStorage.getItem("authUser"));
      console.log("👉 Fallback: authUser from localStorage:", authUser);

      if (authUser && authUser._id) {
        set({ authUser, isCheckingAuth: false });
        connectSocket(); // fallback: dùng user localStorage nếu server fail
      } else {
        console.log("👉 No valid authUser found in localStorage");
        set({ authUser: null, isCheckingAuth: false });
      }
    }
  },
  signUp: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      get().setAuthUser(response.data);
      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response?.status === 410) {
        toast.error("Email already exists. Please use a different email.");
      } else if (error?.response?.status === 409) {
        toast.error("Password must be at least 8 characters long.");
      } else if (error?.response?.status === 408) {
        toast.error("Please fill all fields.");
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      set({ isLoggingIn: true });
      get().setAuthUser(response.data);
      toast.success("Logged in successfully!");

      const { authUser } = get();
      if (authUser && (authUser._id || (authUser.user && authUser.user._id))) {
        get().connectSocket();
      } else {
        console.error("Invalid authUser data:", authUser);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().setAuthUser(null);
      toast.success("Logged out successfully!");
      await get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed");
    }
  },

  updateProfile: async (userData) => {
    set({ isUpdateingProfile: true });
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        userData
      );
      get().setAuthUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdateingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    console.log("👉 Connecting socket for userId:", authUser?._id);
    console.log("👉 Socket Server URL:", BASE_URL);

    if (authUser && authUser._id) {
      const newSocket = io(BASE_URL, {
        query: { userId: authUser._id },
      });
      newSocket.connect();
      set({ socket: newSocket });

      newSocket.on("getOnlineUsers", (userId) => {
        set({ onlineUsers: userId });
      });
    } else {
      console.error("authUser is invalid or does not have _id:", authUser);
    }
  },
  disconnectSocket: async () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }
  },
}));
