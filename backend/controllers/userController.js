import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import sendPasswordResetEmail from "../utils/sendPasswordMail.js";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import crypto from "crypto";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Kullanıcı Kaydı
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Kullanıcı Girişi
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const lastLoginTime = new Date();

    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    let loginLocation = "Unknown";
    try {
      const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`);
      loginLocation = response.data.city || "Unknown";
    } catch (error) {
      console.error("Error getting login location:", error);
    }

    user.lastLoginTime = lastLoginTime;
    user.loginLocation = loginLocation;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      lastLoginTime: user.lastLoginTime,
      loginLocation: user.loginLocation,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Kullanıcı Profili Güncelle
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Mevcut Kullanıcı Profilini Getir
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      lastLoginTime: user.lastLoginTime,
      loginLocation: user.loginLocation,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Tüm Kullanıcıları Getirme
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Kullanıcı Güncelleme
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  console.log("Gelen ID:", userId);

  if (!userId) {
    res.status(400);
    throw new Error("Kullanıcı ID'si eksik.");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Geçersiz kullanıcı ID'si.");
  }

  const user = await User.findById(userId);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı.");
  }
});

// Kullanıcı Silme
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.file) {
      // Eski fotoğrafı silme
      if (
        user.profileImage &&
        fs.existsSync(path.join("uploads", user.profileImage))
      ) {
        fs.unlinkSync(path.join("uploads", user.profileImage));
      }

      user.profileImage = req.file.filename;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("Kullanıcı bulunamadı");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log("Oluşturulan token:", resetToken);

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log(
      "Hashlenmiş token (veritabanına kaydedilecek):",
      user.resetPasswordToken
    );

    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;
    console.log(
      "Token süresi dolum tarihi:",
      new Date(user.resetPasswordExpire)
    );

    await user.save();

    await sendPasswordResetEmail({ email: user.email, resetToken });

    res.status(200).json({ message: "E-posta gönderildi" });
  } catch (error) {
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    console.error("Hata oluştu: ", error.message);
    res
      .status(500)
      .json({ message: "E-posta gönderilemedi", error: error.message });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = req.params.token;
  console.log("Gelen token:", resetPasswordToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");
  console.log("Hashed token:", hashedToken);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    console.error("Geçersiz veya süresi dolmuş token");
    res.status(400);
    throw new Error("Geçersiz veya süresi dolmuş token");
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: "Şifre başarıyla sıfırlandı" });
});

// JWT Token Oluşturma
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export {
  registerUser,
  authUser,
  updateUserProfile,
  getUserProfile,
  getUsers,
  updateUser,
  deleteUser,
  updateUserProfileImage,
  forgotPassword,
  resetPassword,
};
