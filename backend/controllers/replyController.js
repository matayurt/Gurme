import asyncHandler from "express-async-handler";
import Reply from "../models/replyModel.js";

// Onaylanmamış Yanıtları Getir
const getUnapprovedReplies = asyncHandler(async (req, res) => {
  const replies = await Reply.find({ isApproved: false }).populate(
    "comment",
    "name"
  );

  if (!replies) {
    return res.status(404).json({ message: "Onaylanmamış yanıt bulunamadı" });
  }

  res.json(replies);
});

// Yanıtı Onayla
const approveReply = asyncHandler(async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);
  if (reply) {
    reply.isApproved = true;
    await reply.save();
    res.json({ message: "Yanıt onaylandı" });
  } else {
    res.status(404);
    throw new Error("Yanıt bulunamadı");
  }
});

// Yanıtı Sil
const deleteReply = asyncHandler(async (req, res) => {
  const reply = await Reply.findById(req.params.replyId);
  if (reply) {
    await reply.deleteOne();
    res.status(200).json({ message: "Yanıt silindi" });
  } else {
    res.status(404);
    throw new Error("Yanıt bulunamadı");
  }
});

const addReply = asyncHandler(async (req, res) => {
  const { commentId, name, comment } = req.body;

  const newReply = await Reply.create({
    comment: commentId,
    name,
    comment,
    isApproved: false,
  });

  if (newReply) {
    res.status(201).json(newReply);
  } else {
    res.status(400);
    throw new Error("Yanıt eklenemedi");
  }
});

export { getUnapprovedReplies, approveReply, deleteReply, addReply };
