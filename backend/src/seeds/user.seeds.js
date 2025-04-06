import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";
config();

const seedUsers = [
  {
    email: "john.doe@example.com",
    fullname: "John Doe",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "jane.smith@example.com",
    fullname: "Jane Smith",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "michael.brown@example.com",
    fullname: "Michael Brown",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "emily.davis@example.com",
    fullname: "Emily Davis",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "david.jones@example.com",
    fullname: "David Jones",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "sarah.wilson@example.com",
    fullname: "Sarah Wilson",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "chris.moore@example.com",
    fullname: "Chris Moore",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "laura.taylor@example.com",
    fullname: "Laura Taylor",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "daniel.anderson@example.com",
    fullname: "Daniel Anderson",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "olivia.thomas@example.com",
    fullname: "Olivia Thomas",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "james.jackson@example.com",
    fullname: "James Jackson",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "emma.white@example.com",
    fullname: "Emma White",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "william.harris@example.com",
    fullname: "William Harris",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "sophia.martin@example.com",
    fullname: "Sophia Martin",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
  {
    email: "logan.clark@example.com",
    fullname: "Logan Clark",
    password: "password123",
    profilePicture: "https://www.gravatar.com/avatar/?d=mp",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded success");
  } catch (error) {
    console.log(error);
  }
};
seedDatabase();
