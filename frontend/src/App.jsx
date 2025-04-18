import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // Ensure react-hot-toast is installed and imported correctly
import { Loader } from "lucide-react"; // Ensure lucide-react is installed and imported correctly
import { useThemeStore } from "./store/useThemeStore";
export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth(); // chỉ chạy 1 lần khi App khởi động
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  if (isCheckingAuth && !authUser) {
    return <Loader className="w-10 h-10 animate-spin" />;
  }
  return (
    <div data-theme="retro">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login"></Navigate>}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/settings"
          element={
            authUser ? <SettingPage /> : <Navigate to="/login"></Navigate>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Toaster />
    </div>
  );
}
