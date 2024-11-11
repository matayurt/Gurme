import express from "express";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
  editQuestion,
  reorderQuestions,
} from "../controllers/questionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/reorder").put(protect, admin, reorderQuestions);

router.route("/").get(getQuestions).post(protect, admin, addQuestion);
router
  .route("/:id")
  .delete(protect, admin, deleteQuestion)
  .put(protect, admin, editQuestion);

export default router;
