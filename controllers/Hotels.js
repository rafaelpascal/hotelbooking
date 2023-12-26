const Hotels = require("../models/Hotels");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");

// CREATE
const createHotel = AsyncHandler(async (req, res, next) => {
  const newHotel = new Hotels(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(StatusCodes.OK).json({ success: true, savedHotel });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Creating the Hotel",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// UPDATE
const updateHotel = AsyncHandler(async (req, res, next) => {
  const HotelId = req.params.id;
  try {
    const updateHotel = await Hotels.findByIdAndUpdate(
      HotelId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ success: true, updateHotel });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Updating the Hotel",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// DELETE
const deleteHotel = AsyncHandler(async (req, res, next) => {
  const HotelId = req.params.id;
  try {
    await Hotels.findByIdAndDelete(HotelId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Hotel Successfully Deleted" });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Deleting the Hotel",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET A SINGLE HOTEL
const getHotel = AsyncHandler(async (req, res, next) => {
  const HotelId = req.params.id;
  try {
    const hotel = await Hotels.findById(HotelId);
    res.status(StatusCodes.OK).json({ success: true, hotel });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Getting the Hotel",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET ALL
const getAll = AsyncHandler(async (req, res, next) => {
  try {
    const hotels = await Hotels.find({});
    res
      .status(StatusCodes.OK)
      .json({ success: true, hotels, nbHits: hotels.length });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Getting Hotels",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = { createHotel, updateHotel, deleteHotel, getHotel, getAll };
