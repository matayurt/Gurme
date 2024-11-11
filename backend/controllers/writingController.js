import asyncHandler from "express-async-handler";
import Writing from "../models/writingModel.js";
import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
};

// Yazı Ekleme
export const addWriting = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const coverImage = req.files.coverImage ? req.files.coverImage[0].path : null;
  const headerImage = req.files.headerImage
    ? req.files.headerImage[0].path
    : null;

  const writing = new Writing({ title, content, coverImage, headerImage });

  const createdWriting = await writing.save();
  res.status(201).json(createdWriting);
});

// Tüm Yazıları Getirme
export const getAllWritings = asyncHandler(async (req, res) => {
  const writings = await Writing.find({});
  res.json(writings);
});

// Belirli Bir Yazıyı Güncelleme
export const updateWriting = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const coverImage = req.files.coverImage ? req.files.coverImage[0].path : null;
  const headerImage = req.files.headerImage
    ? req.files.headerImage[0].path
    : null;

  const writing = await Writing.findById(id);

  if (writing) {
    writing.title = title || writing.title;
    writing.content = content || writing.content;
    if (coverImage) {
      writing.coverImage = coverImage;
    }
    if (headerImage) {
      writing.headerImage = headerImage;
    }

    const updatedWriting = await writing.save();
    res.json(updatedWriting);
  } else {
    res.status(404);
    throw new Error("Yazı bulunamadı");
  }
});

// Yazı Silme
export const deleteWriting = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const writing = await Writing.findById(id);

  if (writing) {
    if (writing.coverImage) {
      const coverImagePath = path.join(process.cwd(), writing.coverImage);
      deleteFile(coverImagePath);
    }

    if (writing.headerImage) {
      const headerImagePath = path.join(process.cwd(), writing.headerImage);
      deleteFile(headerImagePath);
    }

    const contentImages = writing.content.match(/src="([^"]+)"/g);
    if (contentImages) {
      contentImages.forEach((imageTag) => {
        const imagePath = imageTag.match(/src="([^"]+)"/)[1];
        const absolutePath = path.join(process.cwd(), imagePath);
        deleteFile(absolutePath);
      });
    }

    await Writing.deleteOne({ _id: req.params.id });
    res.json({ message: "Yazı silindi" });
  } else {
    res.status(404);
    throw new Error("Yazı bulunamadı");
  }
});

export const getMostClickedWritings = asyncHandler(async (req, res) => {
  const currentMonth = new Date().getMonth();
  const writings = await Writing.find({
    createdAt: {
      $gte: new Date(new Date().setDate(1)),
      $lt: new Date(new Date().setMonth(currentMonth + 1, 1)),
    },
  })
    .sort({ clickCount: -1 })
    .limit(10);
  res.json(writings);
});

export const incrementClickCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const writing = await Writing.findById(id);
  if (writing) {
    writing.clickCount += 1;
    await writing.save();
    res.json({ message: "Click count updated" });
  } else {
    res.status(404);
    throw new Error("Writing not found");
  }
});

export const getWritingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const writing = await Writing.findById(id);

  if (writing) {
    res.json(writing);
  } else {
    res.status(404);
    throw new Error("Yazı bulunamadı");
  }
});
