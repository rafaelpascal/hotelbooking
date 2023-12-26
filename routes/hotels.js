const express = require("express");
const {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getAll,
} = require("../controllers/Hotels");
const router = express.Router();

router.route("/").post(createHotel).get(getAll);
router.route("/:id").put(updateHotel).delete(deleteHotel).get(getHotel);

module.exports = router;
