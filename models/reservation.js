const { Schema, model, isObjectIdOrHexString } = require("mongoose");

const reservationSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    trim: true,
  },
  date: {
    type: String,
    required: [true, "Please provide a date"],
  },
  time: {
    type: String,
    required: [true, "Please provide a time"],
  },
  guests: {
    type: String,
    required: [true, "Please provide number of guests"],
    min: [1, "Must be at least 1 guest"],
  },
  occasion: {
    type: String,
    default: "None",
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = model("Reservation", reservationSchema);
module.exports = Reservation;
