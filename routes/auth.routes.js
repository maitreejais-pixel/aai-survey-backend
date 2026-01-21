const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Airport = require("../models/Airport");

const router = express.Router();

/* =====================================================
   🔹 REGISTER USER / ADMIN
   ===================================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, airportCode } = req.body;

    if (!email || !password || !airportCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find airport
    const airport = await Airport.findOne({ code: airportCode });
    if (!airport) {
      return res.status(404).json({ message: "Airport not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔧 ROLE DEFAULT FIX
    const roleValue = role ? role.toUpperCase() : "USER";

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: roleValue,
      airport: airport._id,
    });

    res.status(201).json({
      message: "Registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =====================================================
   🔹 LOGIN USER / ADMIN
   ===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).populate("airport");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        airport: user.airport?._id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        airport: user.airport,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
