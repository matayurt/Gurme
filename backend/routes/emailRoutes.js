import express from "express";
import {
  getEmails,
  addEmail,
  deleteEmail,
  toggleEmailActivation,
} from "../controllers/emailController.js";

const router = express.Router();

router.route("/").get(getEmails).post(addEmail);
router.route("/:id").delete(deleteEmail).put(toggleEmailActivation);

export default router;
