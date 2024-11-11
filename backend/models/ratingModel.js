import mongoose from "mongoose";

const ratingSchema = mongoose.Schema(
  {
    service: { type: Number, required: true },
    cleaning: { type: Number, required: true },
    atmosphere: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
