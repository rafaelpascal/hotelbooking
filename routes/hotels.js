const express = require("express");
const {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getAll,
} = require("../controllers/Hotels");
const { VerifyToken, VerifAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.route("/").post(VerifAdmin, createHotel).get(VerifyToken, getAll);
router
  .route("/:id")
  .put(VerifAdmin, updateHotel)
  .delete(VerifAdmin, deleteHotel)
  .get(VerifyToken, getHotel);

module.exports = router;
