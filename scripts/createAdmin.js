require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    email: "admin@aai.com",
    password: hashedPassword,
    role: "ADMIN",
    airport: null, // TEMP: admin analytics only
    isActive: true,
  });

  await admin.save();

  console.log("✅ ADMIN user created");
  process.exit();
}

createAdmin();
