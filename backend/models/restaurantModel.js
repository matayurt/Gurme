import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: false,
  },
  coordinates: {
    type: [Number],
    required: false,
  },
  formattedAddress: String,
});

const restaurantSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: locationSchema,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    description: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
      },
    ],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ location: "2dsphere" });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
