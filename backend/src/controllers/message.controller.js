import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudnary.js";
import { getReceiverSockerId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    if (!loggedInUserId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    console.log("my id", myId);
    if (!myId || !userToChatId) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }); //.sort({ createdAt: 1 }); // Sort messages by creation time

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "Message text or image is required" });
    }

    let imageUrl;
    if (image) {
      const uploadRespone = await cloudinary.uploader.upload(image);
      imageUrl = uploadRespone.secure_url;
    }

    // Tạo tin nhắn mới
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Lưu tin nhắn vào cơ sở dữ liệu
    await newMessage.save();

    // Lấy socketId của người nhận
    const receiverSocketId = getReceiverSockerId(receiverId);
    if (receiverSocketId) {
      // Phát tín hiệu "newMessage" đến client người nhận
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Trả về tin nhắn vừa gửi
    res.status(200).json({ newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: error.message });
  }
};
