const mongoose = require("mongoose");

const RoomsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    roomNumber: [{ number: Number, unavailableDates: { types: [Date] } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rooms", RoomsSchema);
