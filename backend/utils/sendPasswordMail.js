import nodemailer from "nodemailer";
import AdminEmail from "../models/adminEmailModel.js";
import dotenv from "dotenv";
dotenv.config();

const sendPasswordResetEmail = async ({ email, resetToken }) => {
  try {
    const adminEmailData = await AdminEmail.findOne();
    if (!adminEmailData) {
      console.error("Admin maili bulunamadı.");
      return;
    }

    const { email: adminEmail, api: adminApiKey } = adminEmailData;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: adminEmail,
        pass: adminApiKey,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP bağlantı hatası:", error);
      } else {
        console.log("SMTP bağlantısı başarılı.");
      }
    });

    const mailOptions = {
      from: adminEmail,
      to: email,
      subject: "Şifre Sıfırlama İsteği",
      html: `
          <h3>Şifre Sıfırlama Talebi</h3>
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <a href="${process.env.APP_URL}/resetpassword/${resetToken}">Şifreyi Sıfırla</a>
          <br/>
          <p>Eğer bu isteği siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Şifre sıfırlama e-postası başarıyla gönderildi.");
  } catch (error) {
    console.error("Şifre sıfırlama e-posta gönderme hatası:", error);
    throw new Error("E-posta gönderilemedi");
  }
};

export default sendPasswordResetEmail;
