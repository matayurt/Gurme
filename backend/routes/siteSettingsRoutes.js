import express from "express";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../controllers/siteSettingsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getSiteSettings)
  .post(
    protect,
    admin,
    upload.fields([{ name: "favicon" }, { name: "logo" }]),
    updateSiteSettings
  );

export default router;
