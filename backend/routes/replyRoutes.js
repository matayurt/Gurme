import express from "express";
import {
  getUnapprovedReplies,
  approveReply,
  deleteReply,
  addReply,
} from "../controllers/replyController.js";

const router = express.Router();

router.route("/unapproved").get(getUnapprovedReplies);
router.route("/:replyId/approve").put(approveReply);
router.route("/:replyId").delete(deleteReply);
router.route("/reply").post(addReply);

export default router;
