import asyncHandler from "express-async-handler";
import Email from "../models/emailModel.js";

// Tüm mailleri getir
const getEmails = asyncHandler(async (req, res) => {
  const emails = await Email.find({});
  res.json(emails);
});

// Yeni mail ekle
const addEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const emailExists = await Email.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("Bu email zaten kayıtlı");
  }

  const newEmail = new Email({ email });
  const createdEmail = await newEmail.save();
  res.status(201).json(createdEmail);
});

// Mail sil
const deleteEmail = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (email) {
    await email.deleteOne();
    res.json({ message: "Mail silindi" });
  } else {
    res.status(404);
    throw new Error("Mail bulunamadı");
  }
});

// Maili aktif/deaktif et
const toggleEmailActivation = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (email) {
    email.isActive = !email.isActive;
    await email.save();
    res.json(email);
  } else {
    res.status(404);
    throw new Error("Mail bulunamadı");
  }
});

export { getEmails, addEmail, deleteEmail, toggleEmailActivation };
