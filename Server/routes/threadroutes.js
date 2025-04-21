const { google } = require('googleapis');
const LabelController = require('../controllers/labelcontrollers')
const verifyToken = require('../middleware/authmiddleware');
const express = require('express');
const threadRouter = express.Router()
const User = require("../database/models/userModel")

threadRouter.get('/threads', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const threadController = new ThreadController(oauth2Client);
      const { labelIds, query, pageToken, maxResults } = req.query;
  
      const result = await threadController.listThreads(
        labelIds ? labelIds.split(',') : ['INBOX'],
        query || '',
        pageToken || '',
        parseInt(maxResults) || 20
      );
  
      res.json(result);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to list threads' });
    }
  });


  threadRouter.get('/threads/:id', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const threadController = new ThreadController(oauth2Client);
      const threadId = req.params.id;
  
      const thread = await threadController.getThread(threadId);
      res.json(thread);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to get thread' });
    }
  });



  module.exports = threadRouter;