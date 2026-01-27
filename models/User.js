const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      required: true,
    },

    airport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    firstLogin: {
      type: Boolean,
      default: true,
    },
    deviceId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
