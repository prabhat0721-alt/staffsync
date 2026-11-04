const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getLeaves).post(protect, applyLeave);
router.route("/:id").put(protect, updateLeaveStatus);

module.exports = router;