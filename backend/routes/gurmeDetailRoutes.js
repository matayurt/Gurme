import express from "express";
import {
  getGurmeDetail,
  updateGurmeDetail,
} from "../controllers/gurmeDetailController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getGurmeDetail)
  .put(protect, admin, upload.single("image"), updateGurmeDetail);

export default router;
