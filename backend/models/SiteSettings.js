import mongoose from "mongoose";

const siteSettingsSchema = mongoose.Schema(
  {
    siteName: { type: String, required: true },
    favicon: { type: String },
    logo: { type: String },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
