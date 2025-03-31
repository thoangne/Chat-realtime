import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateToken } from "../lib/utils.js";
dotenv.config()


export const signup =async (req, res) => {
    const {fullname, email, password} = req.body;
    try {

        if(!fullname || !email || !password) {
            return res.status(400).json({message: "Please fill all fields"})
        }

        //hash password
        if(password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters long"})
        }

        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
        });

        if(newUser) {

            //generate token
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                token: generateToken(newUser._id, res),
            })
        }else {
            return res.status(400).json({message: "User not created"})
        }

    } catch (error) {
        console.error(error);
        if(error.code === 11000) {
            return res.status(400).json({message: "User already exists"})
        }
        return res.status(500).json({message: "Server error"})
    }

}
export const login = (req, res) => {
    
}
export const logout = (req, res) => {
}