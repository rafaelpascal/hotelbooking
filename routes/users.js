const express = require("express");
const {
  updateUser,
  deleteUser,
  getUser,
  getAllUser,
} = require("../controllers/Users");
const {
  VerifyToken,
  VerifUser,
  VerifAdmin,
} = require("../middlewares/verifyToken");
const router = express.Router();

router.route("/").get(VerifAdmin, getAllUser);
router
  .route("/:id")
  .put(VerifUser, updateUser)
  .delete(VerifUser, deleteUser)
  .get(VerifUser, getUser);

module.exports = router;
