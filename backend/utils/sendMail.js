import nodemailer from "nodemailer";
import Email from "../models/emailModel.js";
import AdminEmail from "../models/adminEmailModel.js";
import dotenv from "dotenv";
dotenv.config();

// Yorum Bildirimi Gönderme
const sendCommentNotification = async (comment) => {
  try {
    const activeEmails = await Email.find({ isActive: true });

    if (activeEmails.length === 0) {
      console.error("Aktif mail adresi bulunamadı.");
      return;
    }

    const adminEmailData = await AdminEmail.findOne();
    if (!adminEmailData) {
      console.error("Admin maili bulunamadı.");
      return;
    }

    const { email: adminEmail, api: adminApiKey } = adminEmailData;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: adminApiKey,
      },
    });

    const mailOptions = {
      from: adminEmail,
      to: activeEmails.map((email) => email.email).join(", "),
      subject: "Yeni Yorum Onayı",
      html: `
        <h3>Yeni Yorum:</h3>
        <p><strong>Kullanıcı:</strong> ${comment.name}</p>
        <p><strong>Yorum:</strong> ${comment.comment}</p>
        <p><strong>Restoran:</strong> ${comment.restaurant.name}</p>
        <br/>
        <a href="${process.env.APP_URL}/api/comments/${comment._id}/approve">Onayla</a> |
        <a href="${process.env.APP_URL}/api/comments/${comment._id}">Sil</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Yorum bildirimi başarıyla gönderildi.");
  } catch (error) {
    console.error("Yorum e-posta gönderme hatası:", error.message);
  }
};

// İletişim Formu Bildirimi Gönderme
const sendContactFormNotification = async ({ name, email, message }) => {
  try {
    const adminEmailData = await AdminEmail.findOne();
    if (!adminEmailData) {
      console.error("Admin maili bulunamadı.");
      return;
    }

    const { email: adminEmail, api: adminApiKey } = adminEmailData;

    const activeEmails = await Email.find({ isActive: true });

    if (activeEmails.length === 0) {
      console.error("Aktif mail adresi bulunamadı.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: adminApiKey,
      },
    });

    const mailOptions = {
      from: email,
      to: activeEmails.map((email) => email.email).join(", "),
      subject: "Yeni İletişim Formu Mesajı",
      html: `
        <h3>Yeni İletişim Mesajı:</h3>
        <p><strong>Adı Soyadı:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Mesaj:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("İletişim formu e-postası başarıyla gönderildi.");
  } catch (error) {
    console.error("İletişim formu e-posta gönderme hatası:", error.message);
  }
};

export { sendCommentNotification, sendContactFormNotification };
