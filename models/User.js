const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is Requires"],
      unique: [true, "Username Already Exist"],
    },
    email: {
      type: String,
      required: [true, "Email is Requires"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: [true, "Email Already Exist"],
    },
    phone: {
      type: String,
      required: [true, "Phone is Requires"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Requires"],
      min: [10, "Last Name Must not be less than 10 characters"],
      max: [100, "Last Name Must not exceed 100 characters"],
    },
    otherName: {
      type: String,
      required: [true, "Other Name is Requires"],
      min: [10, "Other Name Must not be less than 10 characters"],
      max: [100, "Other Name Must not exceed 100 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is Requires"],
      min: [10, "First Name Must not be less than 10 characters"],
      max: [100, "First Name Must not exceed 100 characters"],
    },
    password: {
      type: String,
      required: [true, "must provide Password"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// HASH THE PASSWORD
UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD DURING LOG IN
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// CREATE A TOKEN
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      email: this.email,
      password: this.password,
      userName: this.userName,
      isAdmin: this.isAdmin,
    },
    process.env.JWTSECRET,
    { expiresIn: "3d" }
  );
};

module.exports = mongoose.model("User", UserSchema);
