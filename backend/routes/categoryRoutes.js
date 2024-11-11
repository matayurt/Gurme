import express from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").get(getCategories).post(addCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

export default router;
