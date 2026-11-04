const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// @desc    Check-in attendance
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // Aaj ki date ki shuruat (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check karein ki aaj pehle se check-in kiya hai ya nahi
    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const currentTime = new Date().toLocaleTimeString();

    const attendance = await Attendance.create({
      employee: employee._id,
      status: "Present",
      checkInTime: currentTime,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-out attendance
// @route   PUT /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today },
    });

    if (!attendance) {
      return res.status(404).json({ message: "No check-in record found for today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOutTime = new Date().toLocaleTimeString();
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance records (Admin/HR) or personal (Employee)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    let attendanceRecords;
    if (req.user.role === "Admin" || req.user.role === "HR") {
      attendanceRecords = await Attendance.find({}).populate({
        path: "employee",
        populate: { path: "user", select: "name email role" },
      });
    } else {
      const employee = await Employee.findOne({ user: req.user._id });
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }
      attendanceRecords = await Attendance.find({ employee: employee._id });
    }

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, getAttendance };