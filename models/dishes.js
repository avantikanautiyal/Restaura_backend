const { Schema, model } = require("mongoose");

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
});

module.exports = model("Dish", dishSchema);
