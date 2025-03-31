import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
    },
    profilePicture:{
        type: String,
        default: "https://www.gravatar.com/avatar/?d=mp",
    }},{timestamps: true} // createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
export default User;