import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import path from "path";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import adminEmailRoutes from "./routes/adminEmailRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import gurmeDetailRoutes from "./routes/gurmeDetailRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import writingRoutes from "./routes/writingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const PORT = process.env.PORT || 5000;

ConnectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/site-settings", siteSettingsRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/admin-emails", adminEmailRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/gurmedetail", gurmeDetailRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/writings", writingRoutes);
app.use("/api/contact", contactRoutes);
app.set("trust proxy", 1);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
