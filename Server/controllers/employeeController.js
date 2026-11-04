const Employee = require("../models/Employee");

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin/HR
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}).populate("user", "name email role");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new employee profile
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
  try {
    const { user, employeeId, department, designation, phone, address, dateOfJoining } = req.body;

    // Check karein ki employee ID pehle se exist karti hai ya nahi
    const employeeExists = await Employee.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    const employee = await Employee.create({
      user,
      employeeId,
      department,
      designation,
      phone,
      address,
      dateOfJoining,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEmployees, createEmployee };