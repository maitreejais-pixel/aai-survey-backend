const roleMiddleware = require("../middleware/role.middleware");

router.get(
  "/analytics",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const analytics = await Survey.aggregate([
        {
          $group: {
            _id: "$airport",
            totalSurveys: { $sum: 1 },
            avgCleanliness: { $avg: "$cleanliness" },
            avgSecurity: { $avg: "$security" },
            avgStaffBehavior: { $avg: "$staffBehavior" },
            avgOverallExperience: { $avg: "$overallExperience" },
          },
        },
        {
          $lookup: {
            from: "airports",
            localField: "_id",
            foreignField: "_id",
            as: "airport",
          },
        },
        { $unwind: "$airport" },
        {
          $project: {
            _id: 0,
            airportId: "$airport._id",
            airportName: "$airport.name",
            city: "$airport.city",
            totalSurveys: 1,
            avgCleanliness: { $round: ["$avgCleanliness", 2] },
            avgSecurity: { $round: ["$avgSecurity", 2] },
            avgStaffBehavior: { $round: ["$avgStaffBehavior", 2] },
            avgOverallExperience: { $round: ["$avgOverallExperience", 2] },
          },
        },
      ]);

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
