import express from "express";
import {
  sendContactMail,
  getAllContactMails,
  deleteContactMail,
} from "../controllers/contactMailController.js";

const router = express.Router();

router.post("/", sendContactMail);
router.get("/", getAllContactMails);
router.delete("/:id", deleteContactMail);

export default router;
