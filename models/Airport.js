const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

airportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Airport", airportSchema);
