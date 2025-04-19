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
    origin: [
      "http://localhost:5173", // Phát triển local
      "https://chatty-tgbr.onrender.com", // URL của frontend khi deploy lên Render
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  } else {
    return;
  }

  const onlineUsers = Object.keys(userSocketMap);
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }

    const updatedOnlineUsers = Object.keys(userSocketMap);
    io.emit("getOnlineUsers", updatedOnlineUsers);
  });
});

export { io, app, server };
