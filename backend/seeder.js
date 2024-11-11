import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const users = [
  {
    name: "Admin User 1",
    email: "admin1@example.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
    profileImage: "path/to/image1.png",
    lastLoginTime: new Date(),
  },
  {
    name: "Admin User 2",
    email: "admin2@example.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
    profileImage: "path/to/image2.png",
    lastLoginTime: new Date(),
  },
  {
    name: "Admin User 3",
    email: "admin3@example.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
    profileImage: "path/to/image3.png",
    lastLoginTime: new Date(),
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany();

    await User.insertMany(users);
    console.log("Admin users created successfully!");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
