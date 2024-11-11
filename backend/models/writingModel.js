import mongoose from "mongoose";

const writingSchema = new mongoose.Schema(
  {
    headerImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    clickCount: { type: Number, default: 0 },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Writing = mongoose.model("Writing", writingSchema);

export default Writing;
