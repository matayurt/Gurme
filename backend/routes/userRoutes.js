import express from "express";
import {
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
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/").get(protect, admin, getUsers);
router
  .route("/:id")
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);
router.put(
  "/profile/image",
  protect,
  upload.single("image"),
  updateUserProfileImage
);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

export default router;
