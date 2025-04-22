const express = require("express");
const Dish = require("../models/dishes");

const router = express.Router();

// Get all cuisines
router.get("/cuisines", async (req, res) => {
  try {
    const cuisines = await Dish.distinct("cuisine");
    res.json(cuisines);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get dishes by cuisine
router.get("/cuisine/:cuisineId", async (req, res) => {
  try {
    const dishes = await Dish.find({ cuisine: req.params.cuisineId });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
