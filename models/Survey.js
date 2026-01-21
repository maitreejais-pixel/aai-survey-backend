const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    airportName: String,
    cleanliness: Number,
    security: Number,
    staffBehaviour: Number,
    overallExperience: Number,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", SurveySchema);
