const { google } = require('googleapis');
const ComposeController = require('../controllers/composecontroller')
const verifyToken = require('../middleware/authmiddleware');
const express = require('express');
const composeRouter = express.Router()
const User = require("../database/models/userModel")



composeRouter.get('/drafts', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const maxResults = parseInt(req.query.maxResults) || 50;

    const drafts = await composeController.listDrafts(maxResults);
    res.json(drafts);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to list drafts' });
  }
});



composeRouter.get('/drafts/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const draftId = req.params.id;

    const draft = await composeController.getDraft(draftId);
    res.json(draft);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to get draft' });
  }
});




composeRouter.put('/drafts/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const draftId = req.params.id;
    const emailData = req.body;

    const result = await composeController.updateDraft(draftId, emailData);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to update draft' });
  }
});




composeRouter.post('/drafts/:id/send', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const draftId = req.params.id;

    const result = await composeController.sendDraft(draftId);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to send draft' });
  }
});




composeRouter.delete('/drafts/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const draftId = req.params.id;

    await composeController.deleteDraft(draftId);
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});





module.exports = composeRouter;