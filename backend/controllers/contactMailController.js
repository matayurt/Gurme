import asyncHandler from "express-async-handler";
import ContactMail from "../models/contactMailModel.js";
import { sendContactFormNotification } from "../utils/sendMail.js";

// İletişim formu mesajını kaydet ve yöneticiye bildirim gönder
const sendContactMail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  const newContactMail = new ContactMail({
    name,
    email,
    message,
  });

  const savedMail = await newContactMail.save();

  try {
    await sendContactFormNotification({ name, email, message });
    res
      .status(201)
      .json({ message: "İletişim formu mesajı başarıyla gönderildi!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Mesaj gönderilemedi, ancak veri başarıyla kaydedildi." });
  }
});

// Tüm iletişim formu mesajlarını al
const getAllContactMails = asyncHandler(async (req, res) => {
  const contactMails = await ContactMail.find({});
  res.json(contactMails);
});

// İletişim formu mesajını sil
const deleteContactMail = asyncHandler(async (req, res) => {
  const contactMail = await ContactMail.findById(req.params.id);

  if (contactMail) {
    await contactMail.deleteOne();
    res.json({ message: "İletişim mesajı silindi" });
  } else {
    res.status(404);
    throw new Error("Mesaj bulunamadı");
  }
});

export { sendContactMail, getAllContactMails, deleteContactMail };
