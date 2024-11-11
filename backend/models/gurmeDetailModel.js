import mongoose from "mongoose";

const gurmeDetailSchema = mongoose.Schema(
  {
    titleLeft: {
      type: String,
      required: true,
    },
    titleRight: {
      type: String,
      required: true,
    },
    descriptionLeft: {
      type: String,
      required: true,
    },
    descriptionRight: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GurmeDetail = mongoose.model("GurmeDetail", gurmeDetailSchema);
export default GurmeDetail;
