const express = require("express");
const DashboardRouter = express.Router();
const User = require("../database/models/userModel");
const Dashboard = require("../controllers/Dashboardcontroller");
const verifyToken = require("../middleware/authmiddleware");

DashboardRouter.get("/dashboard/emails", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId);
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: "No Google token found" });
    }

    const dashboard = new Dashboard(userId);
    const result = await dashboard.EmailData();

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error fetching email data:", error);
    res.status(500).json({ error: "Failed to fetch email data" });
  }
});

module.exports = DashboardRouter;
