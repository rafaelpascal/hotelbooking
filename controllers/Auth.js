const User = require("../models/User");
const AsyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

// CREATE USER
const register = AsyncHandler(async (req, res, next) => {
  const findEmail = await User.findOne({ email: req.body.email });
  const findPhone = await User.findOne({ phone: req.body.phone });

  if (findEmail) {
    return next(
      new ErrorHandler(
        `Email ${findEmail.email} Already Exist`,
        StatusCodes.CONFLICT
      )
    );
  }
  if (findPhone) {
    return next(
      new ErrorHandler(
        `Phone Number ${findPhone.phone} Already Exist`,
        StatusCodes.CONFLICT
      )
    );
  }
  try {
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      lastName: req.body.lastName,
      otherName: req.body.otherName,
      firstName: req.body.firstName,
      password: req.body.password,
    });
    const user = await newUser.save();
    const { password, ...otherInfo } = user._doc;
    res
      .status(StatusCodes.CREATED)
      .json({ suceess: true, data: { ...otherInfo } });
  } catch (error) {
    return next(
      new ErrorHandler("Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// SIGN
const signin = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler(`User Does not Exist`, StatusCodes.NOT_FOUND)
      );
    }
    // Check Password
    const isPassword = await user.comparePassword(password);
    if (isPassword) {
      // Create Token
      const accessToken = user.createJWT();
      const { password, ...otherInfo } = user._doc;
      res
        .cookie("access-token", accessToken, {
          httpOnly: true,
        })
        .status(StatusCodes.OK)
        .json({ success: true, data: { ...otherInfo } });
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Wrong User Password" });
    }
  } catch (error) {
    return next(
      new ErrorHandler("Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

// Change Password
const changePassword = AsyncHandler(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler(`User Does not Exist`, StatusCodes.NOT_FOUND)
      );
    }
    if (password !== confirmPassword) {
      return next(
        new ErrorHandler(`Password Doesn't Match!`, StatusCodes.BAD_REQUEST)
      );
    }
    // Check new Password to see if it match the previous Password
    const isPasswordsame = await user.comparePassword(password);
    if (isPasswordsame) {
      return next(
        new ErrorHandler(
          "Can't Use default Password as your password",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    // Hash New Password
    const updatePassword = {
      password: await bcrypt.hash(req.body.password, 10),
    };
    console.log("updatePassword", updatePassword);
    const changepssword = await User.findOneAndUpdate(
      { email },
      updatePassword,
      {
        new: true,
      }
    );
    if (!changepssword) {
      return next(
        new ErrorHandler("Password Not Updated Please try Again", 400)
      );
    }
    res.status(200).json({ success: true, changepssword });
  } catch (error) {
    return next(
      new ErrorHandler("Server Error", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
});

module.exports = { register, signin, changePassword };
