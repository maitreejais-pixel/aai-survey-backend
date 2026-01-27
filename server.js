const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const surveyRoutes = require("./routes/survey.routes");
const airportRoutes = require("./routes/airport.routes"); // ✅ ADD THIS

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/airports", airportRoutes); // ✅ ADD THIS

app.get("/", (req, res) => {
  res.send("Airport Survey Backend Running");
});

// Use process.env.PORT for Railway, fallback to 5000 for local
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
