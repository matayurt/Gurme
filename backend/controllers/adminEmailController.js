import asyncHandler from "express-async-handler";
import AdminEmail from "../models/adminEmailModel.js";

// Tüm admin e-postalarını getir
const getAdminEmails = asyncHandler(async (req, res) => {
  const adminEmails = await AdminEmail.find({});
  res.json(adminEmails);
});

// Yeni admin e-postası ekle
const addAdminEmail = asyncHandler(async (req, res) => {
  const { email, api } = req.body;

  const emailExists = await AdminEmail.findOne({ email });

  if (emailExists) {
    res.status(400);
    throw new Error("Bu email zaten kayıtlı");
  }

  const newAdminEmail = new AdminEmail({ email, api });
  const createdAdminEmail = await newAdminEmail.save();
  res.status(201).json(createdAdminEmail);
});

// Admin e-postasını sil
const deleteAdminEmail = asyncHandler(async (req, res) => {
  const adminEmail = await AdminEmail.findById(req.params.id);

  if (adminEmail) {
    await adminEmail.deleteOne();
    res.json({ message: "Admin e-posta silindi" });
  } else {
    res.status(404);
    throw new Error("Admin e-posta bulunamadı");
  }
});

// Admin e-postasını güncelle
const updateAdminEmail = asyncHandler(async (req, res) => {
  const { email, api } = req.body;

  const adminEmail = await AdminEmail.findById(req.params.id);

  if (adminEmail) {
    adminEmail.email = email || adminEmail.email;
    adminEmail.api = api || adminEmail.api;

    const updatedAdminEmail = await adminEmail.save();
    res.json(updatedAdminEmail);
  } else {
    res.status(404);
    throw new Error("Admin e-posta bulunamadı");
  }
});

export { getAdminEmails, addAdminEmail, deleteAdminEmail, updateAdminEmail };
