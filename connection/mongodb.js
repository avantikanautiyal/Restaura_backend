const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
