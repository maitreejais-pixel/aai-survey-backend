require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Airport = require("../models/Airport");

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);

  const airport = await Airport.findOne({ code: "DEL" });

  if (!airport) {
    console.log("❌ Airport not found");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = new User({
    email: "user@aai.com",
    password: hashedPassword,
    role: "USER",
    airport: airport._id,
    isActive: true,
  });

  await user.save();

  console.log("✅ USER created for airport:", airport.code);
  process.exit();
}

createUser();
