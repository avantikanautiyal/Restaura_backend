const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes
require("dotenv").config();

/**
 * 🔹 Utility function to generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

/**
 * 🔹 User Signup Route (Register a new user)
 */
router.post("/signup", async (req, res) => {
  try {
    let { email, password, fullName, contactNumber } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
      contactNumber,
    });

    // 4. Generate JWT token
    const token = generateToken(newUser);

    // 5. Set JWT as HTTP cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access via JavaScript (XSS protection)
      secure: false,
      sameSite: "Strict", // Prevent CSRF attacks
    });

    console.log("Cookie Set:", token);

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * 🔹 User Login Route
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT token
    const token = generateToken(user);

    // 4. Set JWT as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: false, // Set to true in production (HTTPS)
      sameSite: "lax", // Adjust based on frontend-backend domain setup
    });

    // 5. Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

/**
 * 🔹 Protected Route: Get Current User
 */

router.get("/user:id", authMiddleware, async (req, res) => {
  try {
    // Find user by ID, excluding password
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "Lax", // Match the sameSite attribute
    path: "/", // Ensure the correct path is used
  });
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
