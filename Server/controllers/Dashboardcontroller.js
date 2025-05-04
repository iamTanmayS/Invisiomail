const Email = require("../database/models/emailModel");

class Dashboard {
  constructor(userId) {
    this.userId = userId;
  }

  async EmailData() {
    try {
      const emailDetails = await Email.find({ user: this.userId });

      if (!emailDetails || emailDetails.length === 0) {
        return { status: 404, data: "No emails found for this user" };
      }

      return { status: 200, data: emailDetails };
    } catch (err) {
      return { status: 500, data: err.message };
    }
  }
}

module.exports = Dashboard;
