const express = require("express");
const Rooms = require("../models/Rooms");
const Hotels = require("../models/Hotels");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");

// CREATE ROOM
const createRoom = AsyncHandler(async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Rooms(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(StatusCodes.CREATED).json({ success: true, savedRoom });
  } catch (error) {
    return next(
      new ErrorHandler("Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// UPDATE
const updateRoom = AsyncHandler(async (req, res, next) => {
  const RoomId = req.params.id;
  try {
    const updateRoom = await Rooms.findByIdAndUpdate(
      RoomId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ success: true, updateRoom });
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
const deleteRoom = AsyncHandler(async (req, res, next) => {
  const RoomId = req.params.id;
  try {
    await Rooms.findByIdAndDelete(RoomId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Room Successfully Deleted" });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Deleting the Room",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET A SINGLE HOTEL
const getRoom = AsyncHandler(async (req, res, next) => {
  const RoomId = req.params.id;
  try {
    const Room = await Rooms.findById(RoomId);
    res.status(StatusCodes.OK).json({ success: true, Room });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Getting the Room",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET ALL
const getAll = AsyncHandler(async (req, res, next) => {
  try {
    const rooms = await Rooms.find({});
    res
      .status(StatusCodes.OK)
      .json({ success: true, rooms, nbHits: rooms.length });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Getting Hotel Rooms",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getAll,
};
