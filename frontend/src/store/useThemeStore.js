import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "retro", // Lấy theme từ localStorage nếu có
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme); // Cập nhật vào localStorage
    set({ theme }); // Cập nhật giá trị theme trong store
  },
}));
