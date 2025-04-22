const Reservation = require("../models/reservation");
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/book", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const email = req.user.email;
  try {
    const { name, phone, date, time, guests, occasion, specialRequests } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new reservation
    const reservation = await Reservation.create({
      userId,
      name,
      email,
      phone,
      date,
      time,
      guests,
      occasion: occasion || "None",
      specialRequests: specialRequests || "",
      status: "Confirmed",
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: {
        reservationId: reservation._id,
        userId,
        name,
        date,
        time,
        guests,
      },
    });
  } catch (error) {
    console.error("Reservation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET - Get a specific reservation
router.get("/view", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const reservations = await Reservation.find({ userId });

    return res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error("Fetch reservations error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
