import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ secure trong production (HTTPS)
    maxAge: 60 * 60 * 1000, // 1 giờ
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Linh hoạt trong development
  });

  return token;
};
