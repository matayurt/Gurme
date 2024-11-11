import asyncHandler from "express-async-handler";
import Video from "../models/videoModel.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// YouTube API anahtarı (YouTube Data API v3 için gerekli)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Yeni video ekle
const addVideo = asyncHandler(async (req, res) => {
  const { videoUrl } = req.body;
  const videoId = videoUrl.split("v=")[1].split("&")[0];

  try {
    const existingVideo = await Video.findOne({ url: videoUrl });
    if (existingVideo) {
      res.status(400).json({ message: "Bu video zaten eklendi!" });
      return;
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (response.data.items.length === 0) {
      res.status(404).json({ message: "Video bulunamadı" });
      return;
    }

    const videoInfo = response.data.items[0].snippet;

    const video = new Video({
      title: videoInfo.title,
      url: videoUrl,
      thumbnail: videoInfo.thumbnails.high.url,
      publishedAt: videoInfo.publishedAt,
      location: videoInfo.localized.title,
    });

    const createdVideo = await video.save();
    res.status(201).json(createdVideo);
  } catch (error) {
    console.error("YouTube verileri alınamadı:", error);
    res.status(500).json({ message: "YouTube verileri alınamadı" });
  }
});

// Tüm videoları getir
const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({});
  res.json(videos);
});

// Bir videoyu sil
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (video) {
    await Video.deleteOne({ _id: req.params.id });
    res.json({ message: "Video silindi" });
  } else {
    res.status(404);
    throw new Error("Video bulunamadı");
  }
});

export { addVideo, getVideos, deleteVideo };
