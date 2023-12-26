const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} = require("../controllers/Users");
const router = express.Router();

router.route("/").get(getAllUser);
router.route("/:id").put(updateUser).delete(deleteUser).get(getUser);

module.exports = router;
