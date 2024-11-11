import asyncHandler from "express-async-handler";
import Question from "../models/questionModel.js";

// Tüm soruları getir
const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({}).sort({ position: 1 });
  res.json(questions);
});

// Yeni soru ekle
const addQuestion = asyncHandler(async (req, res) => {
  const { question, answer, isActive } = req.body;

  const lastQuestion = await Question.findOne().sort({ position: -1 });
  const newPosition = lastQuestion ? lastQuestion.position + 1 : 0;

  const newQuestion = new Question({
    question,
    answer,
    isActive,
    position: newPosition,
  });

  const createdQuestion = await newQuestion.save();
  res.status(201).json(createdQuestion);
});

// Soruyu sil
const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (question) {
    await question.deleteOne();
    res.json({ message: "Soru silindi" });
  } else {
    res.status(404);
    throw new Error("Soru bulunamadı");
  }
});

// Soruyu güncelle
const editQuestion = asyncHandler(async (req, res) => {
  const { question, answer, isActive } = req.body;
  const foundQuestion = await Question.findById(req.params.id);
  if (foundQuestion) {
    foundQuestion.question = question;
    foundQuestion.answer = answer;
    foundQuestion.isActive = isActive;
    const updatedQuestion = await foundQuestion.save();
    res.json(updatedQuestion);
  } else {
    res.status(404);
    throw new Error("Soru bulunamadı");
  }
});

// Soruları yeniden sırala
const reorderQuestions = asyncHandler(async (req, res) => {
  const reorderedQuestions = req.body;

  try {
    for (let i = 0; i < reorderedQuestions.length; i++) {
      const question = await Question.findById(reorderedQuestions[i]._id);
      if (question) {
        question.position = i;
        await question.save();
      } else {
        res.status(404);
        throw new Error("Question not found");
      }
    }

    res.status(200).json({ message: "Questions reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error reordering questions" });
  }
});

export {
  getQuestions,
  addQuestion,
  deleteQuestion,
  editQuestion,
  reorderQuestions,
};
