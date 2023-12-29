const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/customError");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

// Verify Token
const VerifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(
      new ErrorHandler(
        `Token not provided, You are not Authorized`,
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  jwt.verify(token, process.env.JWTSECRET, (err, result) => {
    if (err) {
      return next(
        new ErrorHandler(
          `Token is not Valid, You are not Authorized`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    req.user = result;
    next();
  });
};

// VerifyUser
const VerifUser = (req, res, next) => {
  VerifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(
        new ErrorHandler(`You are not Authorized`, StatusCodes.UNAUTHORIZED)
      );
    }
  });
};

// Verify Admin
const VerifAdmin = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(
        new ErrorHandler(
          `You are not an Admin, Not Authorized`,
          StatusCodes.UNAUTHORIZED
        )
      );
    }
  });
};

module.exports = {
  VerifyToken,
  VerifUser,
  VerifAdmin,
};
