import asyncHandler from "express-async-handler";
import Comment from "../models/commentModel.js";
import { sendCommentNotification } from "../utils/sendMail.js";

// Onaylanmamış Yorumları Getir
const getUnapprovedComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ isApproved: false })
    .populate("restaurant", "name")
    .select("name comment");
  res.json(comments);
});

// Yorumu Onayla
const approveComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (comment) {
    comment.isApproved = true;
    await comment.save();
    res.json({ message: "Yorum onaylandı" });
  } else {
    res.status(404);
    throw new Error("Yorum bulunamadı");
  }
});

// Yorumu Sil
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (comment) {
    await comment.deleteOne();
    res.status(200).json({ message: "Yorum silindi" });
  } else {
    res.status(404);
    throw new Error("Yorum bulunamadı");
  }
});

// Yorumu Güncelle
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (comment) {
    comment.comment =
      req.body.comment !== undefined ? req.body.comment : comment.comment;
    comment.name = req.body.name !== undefined ? req.body.name : comment.name;
    await comment.save();
    res.json(comment);
  } else {
    res.status(404);
    throw new Error("Yorum bulunamadı!");
  }
});

// Onaylanmış Yorumları Getir
const getApprovedComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ isApproved: true })
    .populate("restaurant", "name")
    .select("name comment phoneNumber email address createdAt parentComment")
    .sort({ createdAt: -1 });

  if (!comments) {
    return res.status(404).json({ message: "Onaylanmış yorum bulunamadı" });
  }

  res.json(comments);
});

// Yorum Ekle
const addComment = asyncHandler(async (req, res) => {
  const { restaurantId, name, comment, phoneNumber, email, address } = req.body;

  let newComment = await Comment.create({
    restaurant: restaurantId,
    name,
    comment,
    phoneNumber,
    email,
    address,
    createdAt: new Date(),
    isApproved: false,
  });

  if (newComment) {
    newComment = await Comment.findById(newComment._id).populate(
      "restaurant",
      "name"
    );

    await sendCommentNotification(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(400);
    throw new Error("Yorum eklenemedi");
  }
});

// Yoruma Yanıt Ekle
const replyToComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { name, comment } = req.body;

  const parentComment = await Comment.findById(commentId);

  if (!parentComment) {
    res.status(404).json({ message: "Yorum bulunamadı" });
    return;
  }

  const newReply = await Comment.create({
    restaurant: parentComment.restaurant,
    parentComment: parentComment._id,
    name,
    comment,
    createdAt: new Date(),
    isApproved: false,
  });

  if (newReply) {
    res.status(201).json({ message: "Yanıt eklendi", comment: newReply });
  } else {
    res.status(400);
    throw new Error("Yanıt eklenemedi");
  }
});

export {
  getUnapprovedComments,
  approveComment,
  deleteComment,
  getApprovedComments,
  updateComment,
  addComment,
  replyToComment,
};
