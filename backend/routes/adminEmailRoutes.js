import express from "express";
import {
  getAdminEmails,
  addAdminEmail,
  deleteAdminEmail,
  updateAdminEmail,
} from "../controllers/adminEmailController.js";

const router = express.Router();

router.route("/").get(getAdminEmails).post(addAdminEmail);
router.route("/:id").delete(deleteAdminEmail).put(updateAdminEmail);

export default router;
