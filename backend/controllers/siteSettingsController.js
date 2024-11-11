import asyncHandler from "express-async-handler";
import SiteSettings from "../models/SiteSettings.js";

const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({});
  res.json(settings || {});
});

const updateSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne({});

  if (!settings) {
    settings = new SiteSettings();
  }

  if (req.body.siteName) {
    settings.siteName = req.body.siteName;
  }

  if (req.files) {
    if (req.files.favicon) {
      settings.favicon = `http://localhost:5001/${req.files.favicon[0].filename}`;
    }

    if (req.files.logo) {
      settings.logo = `http://localhost:5001/${req.files.logo[0].filename}`;
    }
  }

  await settings.save();
  res.json(settings);
});

export { getSiteSettings, updateSiteSettings };
