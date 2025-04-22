const express = require("express");
const Cart = require("../models/cart");

const router = express.Router();

// Add to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, dishId, quantity } = req.body;
    let cartItem = await Cart.findOne({ userId, dishId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, dishId, quantity });
    }

    res.json({ message: "Item added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get cart items
router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate(
      "dishId"
    );
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
