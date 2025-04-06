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
    console.log("🔄 Đang lấy danh sách người dùng đã chat...");
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
      console.log("✅ Lấy users thành công:", res.data.users);
    } catch (error) {
      console.error("❌ Lỗi khi lấy users:", error);
      toast.error(error.response?.data?.messages || "Something went wrong!");
    } finally {
      set({ isUserLoading: false });
    }
  },

  // ✅ Get toàn bộ tin nhắn với 1 người dùng
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    console.log(`🔄 Đang lấy tin nhắn với userId: ${userId}`);
    try {
      const res = await axiosInstance.get(`messages/${userId}`);
      set({ messages: res.data.messages });
      console.log("✅ Lấy messages thành công:", res.data.messages);
    } catch (error) {
      console.error("❌ Lỗi khi lấy messages:", error);
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

    console.log("📤 Đang gửi tin nhắn tới:", selectedUser._id);
    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedUser._id}`,
        messageData
      );
      const newMessage = res.data.newMessage;
      console.log("✅ Tin nhắn gửi thành công:", newMessage);

      set({ messages: [...messages, newMessage] });
      return newMessage;
    } catch (error) {
      console.error("❌ Lỗi khi gửi tin nhắn:", error);
      toast.error(error.response?.data?.messages || "Failed to send message");
      throw error;
    }
  },

  // ✅ Lắng nghe tin nhắn realtime
  subscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;

    if (socket) {
      console.log("🔌 Subscribed to socket 'newMessage' event");

      socket.on("newMessage", (newMessage) => {
        const { selectedUser } = get();
        console.log("📨 Nhận được tin nhắn realtime:", newMessage);
        if (newMessage.senderId !== selectedUser._id) return;
        const isRelevant =
          selectedUser &&
          (newMessage.senderId === selectedUser._id ||
            newMessage.receiverId === selectedUser._id);

        if (!isRelevant) {
          console.log(
            "ℹ️ Tin nhắn không thuộc user đang chọn, bỏ qua display."
          );
          return;
        }

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        console.log("✅ Tin nhắn đã thêm vào messages state.");
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
      console.log("🔌 Đã hủy subscribe sự kiện 'newMessage'");
    } else {
      console.warn("⚠️ Socket chưa được khởi tạo.");
    }
  },

  // ✅ Chọn người để chat
  setSelectedUser: (selectedUser) => {
    console.log("👤 Đã chọn người dùng:", selectedUser);
    set({ selectedUser });
  },
}));
