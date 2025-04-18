import { app, server } from "./lib/socket.js"; // Nhớ thay đổi đường dẫn chính xác nếu cần
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import express from "express";
dotenv.config();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
// index.js hoặc server.js
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatty-tgbr.onrender.com"],
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if (process.env.NODE_ENV === "production") {
  console.log("Production mode", process.env.NODE_ENV);
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
console.log("Production mode", process.env.NODE_ENV);

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
