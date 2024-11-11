import mongoose from "mongoose";

const sliderSchema = mongoose.Schema(
  {
    page: { type: String, required: true },
    name: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
