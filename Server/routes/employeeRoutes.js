const express = require("express");
const router = express.Router();
const {
  getEmployees,
  createEmployee,
} = require("../controllers/employeeController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, getEmployees).post(protect, admin, createEmployee);

module.exports = router;