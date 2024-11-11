import express from "express";
import {
  addVideo,
  getVideos,
  deleteVideo,
} from "../controllers/videoController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Videoları getir
router.route("/").get(getVideos);

// Yeni bir video ekle
router.route("/add").post(protect, admin, addVideo);

// Bir videoyu sil
router.route("/:id").delete(protect, admin, deleteVideo);

export default router;
