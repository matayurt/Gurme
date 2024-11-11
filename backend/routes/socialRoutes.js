import express from "express";
import {
  getSocialLinks,
  updateSocialLinks,
} from "../controllers/socialController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getSocialLinks).put(protect, admin, updateSocialLinks);

export default router;
