const User = require("../models/User");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");

// Update User
const updateUser = AsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new ErrorHandler("User Not found", StatusCodes.NOT_FOUND));
  }
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ success: true, updated });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Updating the User",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// Delete Account
const deleteUser = AsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return next(new ErrorHandler("User Not found", StatusCodes.NOT_FOUND));
  }
  try {
    await User.findByIdAndDelete(userId);
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Account Successfully Deleted" });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Deleting the User",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET A SINGLE User
const getUser = AsyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(StatusCodes.OK).json({ success: true, user });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Error Getting the User",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

// GET ALL User
const getAllUser = AsyncHandler(async (req, res, next) => {
  try {
    const user = await User.find({});
    res
      .status(StatusCodes.OK)
      .json({ success: true, user, nbHits: user.length });
  } catch (error) {
    return next(
      new ErrorHandler("Error Getting User", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
};
