const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },

  dishId: {
    type: Array,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },
});

const Cart = model("Cart", cartSchema);
module.exports = Cart;
