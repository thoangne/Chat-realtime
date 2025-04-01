import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug

    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user); // Debug

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
