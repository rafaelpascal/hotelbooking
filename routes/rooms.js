const express = require("express");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getRoom,
  getAll,
} = require("../controllers/Rooms");
const { VerifyToken, VerifAdmin } = require("../middlewares/verifyToken");
const router = express.Router();

router.route("/:hotelId").post(VerifAdmin, createRoom);
router
  .route("/:id")
  .put(VerifAdmin, updateRoom)
  .delete(VerifAdmin, deleteRoom)
  .get(VerifyToken, getRoom);
router.route("/rooms").get(getAll);

module.exports = router;
