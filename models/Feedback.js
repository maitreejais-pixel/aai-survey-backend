const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    airport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },

    rating: {
      type: String,
      enum: ["POOR", "FAIR", "GOOD", "EXCELLENT"],
      required: true,
    },

    comment: {
      type: String,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
