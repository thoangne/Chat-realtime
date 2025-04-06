import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {};

export function getReceiverSockerId(userId) {
  return userSocketMap[userId];
}

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected with socket ID:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("🔐 userId from client query:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("🟢 userSocketMap updated:", userSocketMap);
  } else {
    console.warn("⚠️ No userId provided in socket handshake query!");
  }

  const onlineUsers = Object.keys(userSocketMap);
  console.log("📤 Emitting online users:", onlineUsers);
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected with socket ID:", socket.id);

    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        console.log(`🗑️ Removed userId ${userId} from userSocketMap`);
        break;
      }
    }

    const updatedOnlineUsers = Object.keys(userSocketMap);
    console.log("📤 Emitting updated online users:", updatedOnlineUsers);
    io.emit("getOnlineUsers", updatedOnlineUsers);
  });
});

export { io, app, server };
