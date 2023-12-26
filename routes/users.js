const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} = require("../controllers/Users");
const { VerifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.route("/").get(VerifyToken, getAllUser);
router.route("/:id").put(updateUser).delete(deleteUser).get(getUser);

module.exports = router;
