import express from "express";
import {
  getSliders,
  addSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/sliderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getSliders)
  .post(protect, admin, upload.array("images", 10), addSlider);

router
  .route("/:id")
  .put(protect, admin, upload.array("images", 10), updateSlider)
  .delete(protect, admin, deleteSlider);

export default router;
