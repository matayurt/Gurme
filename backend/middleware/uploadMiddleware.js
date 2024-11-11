import multer from "multer";
import path from "path";

// Dosya depolama yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Dosya filtreleme ve boyut sınırı
const upload = multer({
  storage: storage,
  limits: { fieldSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hata: Sadece resim dosyaları yüklenebilir!"));
    }
  },
});

export default upload;
