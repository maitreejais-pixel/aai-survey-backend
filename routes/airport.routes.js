const express = require("express");
const router = express.Router();
const Airport = require("../models/Airport"); // path must be correct

router.post("/", async (req, res) => {
  try {
    const { code, name, city, latitude, longitude } = req.body;

    if (!code || !name || !city || latitude == null || longitude == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Airport.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Airport already exists" });
    }

    const airport = new Airport({
      code,
      name,
      city,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await airport.save();
    res.status(201).json(airport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
