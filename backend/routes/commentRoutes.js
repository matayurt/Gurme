import express from "express";
const router = express.Router();
import {
  getUnapprovedComments,
  approveComment,
  deleteComment,
  getApprovedComments,
  updateComment,
  addComment,
  replyToComment,
} from "../controllers/commentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Bütün onaylanmamış yorumları getir
router.route("/unapproved").get(protect, admin, getUnapprovedComments);

// Bütün onaylanmış yorumları getir
router.route("/approved").get(protect, admin, getApprovedComments);

// ID ye göre yorum onaylama
router.route("/:commentId/approve").put(protect, admin, approveComment);

// ID ye göre yorum silme
router.route("/:commentId").delete(protect, admin, deleteComment);

// Yorum Güncelleme
router.route("/:commentId").put(protect, admin, updateComment);

// Yorum ekleme
router.route("/").post(addComment);

// Yorum yanıtı ekleme
router.post("/:commentId/reply", replyToComment);

export default router;
