const express = require("express");
const Survey = require("../models/Survey");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * ======================================================
 * SUBMIT SURVEY (ONE TIME PER USER PER AIRPORT)
 * ======================================================
 */
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { cleanliness, security, staffBehavior, overallExperience } =
      req.body;

    // ✅ Correct validation (allows 1–5)
    if (
      cleanliness == null ||
      security == null ||
      staffBehavior == null ||
      overallExperience == null
    ) {
      return res.status(400).json({ message: "All ratings are required" });
    }

    // ✅ Auth safety check
    if (!req.user || !req.user.id || !req.user.airport) {
      return res.status(401).json({
        message: "Invalid token or user not linked to airport",
      });
    }

    const survey = new Survey({
      user: req.user.id,
      airport: req.user.airport,
      cleanliness,
      security,
      staffBehavior,
      overallExperience,
    });

    await survey.save();

    res.status(201).json({
      message: "Survey submitted successfully",
    });
  } catch (error) {
    console.error("Survey submit error:", error);

    // ✅ Duplicate survey handling
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already submitted a survey for this airport",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
