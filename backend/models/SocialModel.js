import mongoose from "mongoose";

const socialSchema = mongoose.Schema(
  {
    facebook: {
      link: { type: String, default: "" },
      active: { type: Boolean, default: true },
    },
    x: {
      link: { type: String, default: "" },
      active: { type: Boolean, default: true },
    },
    linkedin: {
      link: { type: String, default: "" },
      active: { type: Boolean, default: true },
    },
    instagram: {
      link: { type: String, default: "" },
      active: { type: Boolean, default: true },
    },
    youtube: {
      link: { type: String, default: "" },
      active: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const SocialLinks = mongoose.model("SocialLinks", socialSchema);
export default SocialLinks;
