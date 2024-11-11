import asyncHandler from "express-async-handler";
import fs from "fs";
import path from "path";
import GurmeDetail from "../models/gurmeDetailModel.js";

// Tüm gurme detaylarını getir
const getGurmeDetail = asyncHandler(async (req, res) => {
  const gurmeDetail = await GurmeDetail.findOne({});
  res.json(gurmeDetail);
});

// Gurme detaylarını güncelle
const updateGurmeDetail = asyncHandler(async (req, res) => {
  const { titleLeft, titleRight, descriptionLeft, descriptionRight } = req.body;

  let gurmeDetail = await GurmeDetail.findOne({});

  if (gurmeDetail) {
    if (req.file) {
      const oldImagePath = path.join(process.cwd(), gurmeDetail.image);

      if (gurmeDetail.image && fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (error) {
          console.error(`Eski dosya silinirken hata oluştu: ${error.message}`);
        }
      }

      gurmeDetail.image = `http://localhost:5001/uploads/${req.file.filename}`;
    }

    gurmeDetail.titleLeft = titleLeft.trim() || gurmeDetail.titleLeft;
    gurmeDetail.titleRight = titleRight.trim() || gurmeDetail.titleRight;
    gurmeDetail.descriptionLeft =
      descriptionLeft.trim() || gurmeDetail.descriptionLeft;
    gurmeDetail.descriptionRight =
      descriptionRight.trim() || gurmeDetail.descriptionRight;

    const updatedDetail = await gurmeDetail.save();
    res.json(updatedDetail);
  } else {
    gurmeDetail = new GurmeDetail({
      titleLeft: titleLeft.trim(),
      titleRight: titleRight.trim(),
      descriptionLeft: descriptionLeft.trim(),
      descriptionRight: descriptionRight.trim(),
      image: req.file
        ? `http://localhost:5001/uploads/${req.file.filename}`
        : undefined,
    });

    const createdDetail = await gurmeDetail.save();
    res.status(201).json(createdDetail);
  }
});

export { getGurmeDetail, updateGurmeDetail };
