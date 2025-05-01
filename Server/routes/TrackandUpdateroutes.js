const express = require('express');
const { google } = require('googleapis');
const verifyToken = require("../middleware/authmiddleware.js");
const User = require("../database/models/userModel.js");
const TrackandUpdateMailController = require("../controllers/TrackandUpdateMailController.js");

const emailRouter = express.Router();

/**
 * Route for sending emails with tracking
 */
emailRouter.post('/sendMail', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    // Set up OAuth client with user's token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });
    req.oauth2Client = oauth2Client;

    await TrackandUpdateMailController.sendAndSave(req, res);
   
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send and save email',
      message: error.message 
    });
  }
});

/**
 * Route for tracking email opens
 * This endpoint returns a transparent 1x1 pixel and records when an email is viewed
 */
emailRouter.get('/track/:id', TrackandUpdateMailController.trackEmail);

module.exports = emailRouter;