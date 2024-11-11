import asyncHandler from "express-async-handler";
import SocialLinks from "../models/SocialModel.js";

// Tüm sosyal medya linklerini getir
const getSocialLinks = asyncHandler(async (req, res) => {
  const socialLinks = await SocialLinks.findOne({});
  res.json(socialLinks);
});

// Sosyal medya linklerini güncelle
const updateSocialLinks = asyncHandler(async (req, res) => {
  const { facebook, x, linkedin, instagram, youtube } = req.body;

  let socialLinks = await SocialLinks.findOne({});

  if (socialLinks) {
    socialLinks.facebook =
      typeof facebook === "object" ? facebook : { link: "", active: true };
    socialLinks.x = typeof x === "object" ? x : { link: "", active: true };
    socialLinks.linkedin =
      typeof linkedin === "object" ? linkedin : { link: "", active: true };
    socialLinks.instagram =
      typeof instagram === "object" ? instagram : { link: "", active: true };
    socialLinks.youtube =
      typeof youtube === "object" ? youtube : { link: "", active: true };

    const updatedLinks = await socialLinks.save();
    res.json(updatedLinks);
  } else {
    socialLinks = new SocialLinks({
      facebook:
        typeof facebook === "object" ? facebook : { link: "", active: true },
      x: typeof x === "object" ? x : { link: "", active: true },
      linkedin:
        typeof linkedin === "object" ? linkedin : { link: "", active: true },
      instagram:
        typeof instagram === "object" ? instagram : { link: "", active: true },
      youtube:
        typeof youtube === "object" ? youtube : { link: "", active: true },
    });

    const createdLinks = await socialLinks.save();
    res.status(201).json(createdLinks);
  }
});

export { getSocialLinks, updateSocialLinks };
