import Restaurant from "../models/restaurantModel.js";
import asyncHandler from "express-async-handler";
import axios from "axios";
import Rating from "../models/ratingModel.js";
import Comment from "../models/commentModel.js";

// Yeni yorum ekle
export const addComment = asyncHandler(async (req, res) => {
  const { name, comment, phoneNumber, email, address } = req.body;

  const newComment = await Comment.create({
    restaurant: req.params.restaurantId,
    name,
    comment,
    phoneNumber,
    email,
    address,
    isApproved: false,
  });

  if (newComment) {
    res.status(201).json(newComment);
  } else {
    res.status(400);
    throw new Error("Yorum eklenemedi");
  }
});

// Tavsiye Ekle
export const addRestaurant = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    district,
    city,
    country,
    latitude,
    longitude,
    service,
    cleaning,
    atmosphere,
    price,
    category,
    phoneNumber,
    website,
    description,
  } = req.body;

  if (!name || !address || !district || !city || !country || !description) {
    res.status(400);
    throw new Error("Lütfen tüm alanları doldurun.");
  }

  if (!latitude || !longitude) {
    res.status(400);
    throw new Error("Lütfen geçerli bir konum seçin.");
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const formattedAddress = response.data.results[0]?.formatted_address;

    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
      formattedAddress,
    };

    const images = req.files ? req.files.map((file) => file.path) : [];

    const rating = new Rating({
      service,
      cleaning,
      atmosphere,
      price,
    });
    const savedRating = await rating.save();

    const restaurant = new Restaurant({
      name,
      address,
      district,
      city,
      country,
      category,
      phoneNumber,
      website,
      description,
      images,
      location,
      ratings: [savedRating._id],
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ message: "Restoran Eklerken Bir Sorun Oluştu!" });
  }
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    district,
    city,
    country,
    service,
    cleaning,
    atmosphere,
    price,
    category,
    phoneNumber,
    website,
    description,
  } = req.body;

  const images = req.files ? req.files.map((file) => file.path) : [];

  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.district = district || restaurant.district;
    restaurant.city = city || restaurant.city;
    restaurant.country = country || restaurant.country;
    restaurant.category = category || restaurant.category;
    restaurant.phoneNumber = phoneNumber || restaurant.phoneNumber;
    restaurant.website = website || restaurant.website;
    restaurant.description = description || restaurant.description;

    if (images.length > 0) {
      restaurant.images = images;
    }

    if (service || cleaning || atmosphere || price) {
      let rating;
      if (restaurant.ratings && restaurant.ratings.length > 0) {
        rating = await Rating.findById(restaurant.ratings[0]);
        if (rating) {
          rating.service = service || rating.service;
          rating.cleaning = cleaning || rating.cleaning;
          rating.atmosphere = atmosphere || rating.atmosphere;
          rating.price = price || rating.price;
          await rating.save();
        }
      } else {
        rating = new Rating({ service, cleaning, atmosphere, price });
        const savedRating = await rating.save();
        restaurant.ratings.push(savedRating._id);
      }
    }

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } else {
    res.status(404);
    throw new Error("Restoran Bulunamadı!");
  }
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    await Rating.deleteMany({ _id: { $in: restaurant.ratings } });

    await restaurant.deleteOne();
    res.json({ message: "Restaurant ve ilişkili puanlar silindi" });
  } else {
    res.status(404);
    throw new Error("Restaurant not found");
  }
});

export const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({})
    .populate("ratings")
    .populate("category")
    .populate({
      path: "comments",
      match: { isApproved: true },
      model: "Comment",
    });
  res.json(restaurants);
});

export const getRestaurantDetails = asyncHandler(async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "comments"
    );

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404);
      throw new Error("Restoran bulunamadı");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getRestaurantFoods = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const foods = await Food.find({ restaurant: restaurantId });

    if (foods && foods.length > 0) {
      res.json(foods);
    } else {
      res.status(404).json({ message: "Yemek bulunamadı!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Yemekler alınamadı!" });
  }
});

export const getRestaurantRatings = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate(
    "ratings"
  );

  if (restaurant && restaurant.ratings.length > 0) {
    res.json(restaurant.ratings[0]);
  } else {
    res.status(404);
    throw new Error("Restoran veya puanlama bulunamadı");
  }
});

export const incrementRestaurantView = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      restaurant.viewCount += 1;
      await restaurant.save();
      res.status(200).json({ message: "View count incremented" });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
