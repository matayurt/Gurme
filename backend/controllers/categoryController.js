import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

// Tüm kategorileri getirme
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .populate("ancestors", "name")
    .exec();

  if (!categories || categories.length === 0) {
    return res.json([]);
  }

  res.json(categories);
});

// Kategori ekleme
const addCategory = asyncHandler(async (req, res) => {
  const { name, parentId } = req.body;

  const newCategory = new Category({
    name,
    parentId,
  });

  if (parentId) {
    const parentCategory = await Category.findById(parentId);
    if (parentCategory) {
      newCategory.ancestors = [...parentCategory.ancestors, parentCategory._id];
    } else {
      res.status(404);
      throw new Error("Parent category not found");
    }
  }

  const createdCategory = await newCategory.save();
  res.status(201).json(createdCategory);
});

// Kategori güncelleme
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    const { name, parentId } = req.body;

    category.name = name || category.name;

    if (parentId && parentId !== category.parentId?.toString()) {
      const parentCategory = await Category.findById(parentId);
      if (parentCategory) {
        category.ancestors = [...parentCategory.ancestors, parentCategory._id];
        category.parentId = parentId;
      } else {
        res.status(404);
        throw new Error("Parent category not found");
      }
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Kategori bulunamadı");
  }
});

// Kategori silme
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: "Kategori silindi" });
  } else {
    res.status(404);
    throw new Error("Kategori bulunamadı");
  }
});

export { getCategories, addCategory, updateCategory, deleteCategory };
