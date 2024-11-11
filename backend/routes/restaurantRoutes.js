import express from "express";
import {
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurants,
  getRestaurantFoods,
  getRestaurantRatings,
  addComment,
  getRestaurantDetails,
  incrementRestaurantView,
} from "../controllers/restaurantController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getRestaurants)
  .post(protect, admin, upload.array("images", 10), addRestaurant);

router
  .route("/:id")
  .put(protect, admin, upload.array("images", 10), updateRestaurant)
  .delete(protect, admin, deleteRestaurant);
router.get("/:restaurantId/foods", getRestaurantFoods);

router.route("/:restaurantId/comments").post(addComment);

router.route("/:id").get(getRestaurantDetails);

router.put("/:id/view", incrementRestaurantView);

export default router;
