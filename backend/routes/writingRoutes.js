import express from "express";
import {
  addWriting,
  getAllWritings,
  updateWriting,
  deleteWriting,
  getMostClickedWritings,
  incrementClickCount,
  getWritingById,
} from "../controllers/writingController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Tüm yazıları getir
router.route("/").get(getAllWritings);

// Yeni yazı ekle
router.route("/").post(
  protect,
  admin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "headerImage", maxCount: 1 },
  ]),
  addWriting
);

router.route("/most-clicked").get(getMostClickedWritings);

router.route("/:id/click").post(incrementClickCount);

// Belirli bir yazıyı güncelle ve sil
router
  .route("/:id")
  .get(getWritingById)
  .put(
    protect,
    admin,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "headerImage", maxCount: 1 },
    ]),
    updateWriting
  )
  .delete(protect, admin, deleteWriting);

export default router;
