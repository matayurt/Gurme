import asyncHandler from "express-async-handler";
import Slider from "../models/sliderModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Slider ekle
const addSlider = asyncHandler(async (req, res) => {
  const { name, page } = req.body;
  const images = req.files.map(
    (file) => `http://localhost:5001/uploads/${file.filename}`
  );

  const slider = new Slider({
    name,
    page,
    images,
  });

  const createdSlider = await slider.save();
  res.status(201).json(createdSlider);
});

// Tüm sliderları getir (belirli bir sayfa için)
const getSliders = asyncHandler(async (req, res) => {
  const { page } = req.query;

  const query = page ? { page } : {};

  const sliders = await Slider.find(query);
  res.json(sliders);
});

// Slider güncelle
const updateSlider = asyncHandler(async (req, res) => {
  const { name, page } = req.body;
  const images = req.files.map(
    (file) => `http://localhost:5001/uploads/${file.filename}`
  );

  const slider = await Slider.findById(req.params.id);

  if (slider) {
    slider.name = name || slider.name;
    slider.page = page || slider.page;

    // Eski resimleri sil
    if (req.files && req.files.length > 0) {
      slider.images.forEach((image) => {
        const imagePath = path.resolve(
          __dirname,
          "..",
          "..",
          "uploads",
          path.basename(image)
        );
        fs.unlink(imagePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error(`Fotoğraf silinirken hata oluştu: ${err.message}`);
          } else if (!err) {
            console.log(`Fotoğraf başarıyla silindi: ${imagePath}`);
          }
        });
      });

      slider.images = images;
    }

    const updatedSlider = await slider.save();
    res.json(updatedSlider);
  } else {
    res.status(404);
    throw new Error("Slider bulunamadı");
  }
});

// Slider sil
const deleteSlider = asyncHandler(async (req, res) => {
  const slider = await Slider.findById(req.params.id);

  if (slider) {
    slider.images.forEach((image) => {
      const imagePath = path.resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        path.basename(image)
      );
      fs.unlink(imagePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error(`Fotoğraf silinirken hata oluştu: ${err.message}`);
        } else if (!err) {
          console.log(`Fotoğraf başarıyla silindi: ${imagePath}`);
        }
      });
    });

    await Slider.deleteOne({ _id: req.params.id });
    res.json({ message: "Slider silindi" });
  } else {
    res.status(404);
    throw new Error("Slider bulunamadı");
  }
});

export { addSlider, getSliders, updateSlider, deleteSlider };
