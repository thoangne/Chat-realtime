import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudnary.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user_id;

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
    const myId = req.user_id;

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
    const senderId = req.user_id;
    let imageUrl;
    if (image) {
      const uploadRespone = await cloudinary.uploader.upload(image);
      imageUrl = uploadRespone.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    //todo realtime functionly
    res.status(200).json({ newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error });
  }
};
