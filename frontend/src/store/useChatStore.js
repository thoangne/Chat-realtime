import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isUsersLoading: false,
  isMessageLoading: false,

  // ✅ Get danh sách người dùng đã từng nhắn tin
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      toast.error(error.response?.data?.messages || "Something went wrong!");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // ✅ Get toàn bộ tin nhắn với 1 người dùng
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response?.data?.messages || "Failed to load messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // ✅ Gửi tin nhắn
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) {
      toast.error("No recipient selected.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedUser._id}`,
        messageData
      );
      const newMessage = res.data.newMessage;

      set({ messages: [...messages, newMessage] });
      return newMessage;
    } catch (error) {
      toast.error(error.response?.data?.messages || "Failed to send message");
      throw error;
    }
  },

  // ✅ Lắng nghe tin nhắn realtime
  subscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) {
      socket.on("newMessage", (newMessage) => {
        const { selectedUser } = get();
        if (newMessage.senderId !== selectedUser._id) return;
        const isRelevant =
          selectedUser &&
          (newMessage.senderId === selectedUser._id ||
            newMessage.receiverId === selectedUser._id);

        if (!isRelevant) {
          return;
        }

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    } else {
      console.warn("⚠️ Socket chưa được khởi tạo.");
    }
  },

  // ✅ Hủy lắng nghe tin nhắn
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    } else {
      console.warn("⚠️ Socket chưa được khởi tạo.");
    }
  },
  // ✅ Chọn người để chat
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
