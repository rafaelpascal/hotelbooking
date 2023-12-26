const express = require("express");
const { register, signin, changePassword } = require("../controllers/Auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/signin").post(signin);
router.route("/changePassword").post(changePassword);

module.exports = router;
