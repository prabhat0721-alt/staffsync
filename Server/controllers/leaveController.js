const Leave = require("../models/Leave");
const Employee = require("../models/Employee");

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const leave = await Leave.create({
      employee: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leaves (Admin/HR) or personal leaves (Employee)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    let leaves;
    if (req.user.role === "Admin" || req.user.role === "HR") {
      leaves = await Leave.find({}).populate({
        path: "employee",
        populate: { path: "user", select: "name email role" },
      });
    } else {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
      leaves = await Leave.find({ employee: employee._id });
    }

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private/Admin/HR
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status || leave.status;
    const updatedLeave = await leave.save();

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };