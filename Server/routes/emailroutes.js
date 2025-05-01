const { google } = require('googleapis');
const EmailController = require('../controllers/gmailcontrollers');
const verifyToken = require('../middleware/authmiddleware');
const express = require('express');
const emailRouter = express.Router()
const User = require("../database/models/userModel")
const ComposeController = require('../controllers/composecontroller')

emailRouter.get('/emails', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;

    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const { labelIds, query, pageToken, maxResults } = req.query;

    const result = await emailController.listEmails(
      labelIds ? labelIds.split(',') : ['INBOX'],
      query || '',
      pageToken || '',
      parseInt(maxResults) || 20
    );

    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

emailRouter.post('/send-email', verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(req.oauth2Client);
    const emailData = req.body; 

    const result = await composeController.sendEmail(emailData);
    res.json(result);

  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});


emailRouter.post('/emails/:id/read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const messageId = req.params.id;

    const result = await emailController.markAsRead(messageId);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to mark email as read' });
  }
});



emailRouter.post('/emails/:id/unread', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const messageId = req.params.id;

    const result = await emailController.markAsUnread(messageId);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to mark email as unread' });
  }
});


emailRouter.post('/emails/:id/archive', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const messageId = req.params.id;

    const result = await emailController.archiveEmail(messageId);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to archive email' });
  }
});




emailRouter.post('/emails/:id/trash', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const messageId = req.params.id;

    const result = await emailController.trashEmail(messageId);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to trash email' });
  }
});



emailRouter.post('/drafts', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const composeController = new ComposeController(oauth2Client);
    const emailData = req.body; // { to, subject, body, cc, bcc }

    const result = await composeController.createDraft(emailData);
    res.json(result);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to create draft' });
  }
});



emailRouter.get('/drafts', verifyToken, async (req, res) => {
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



emailRouter.get('/drafts/:id', verifyToken, async (req, res) => {
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

emailRouter.get('/emails/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.googleId;
    const user = await User.findOne({ googleId: userId });
    if (!user || !user.googleAccessToken) {
      return res.status(401).json({ error: 'No Google token found' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.googleAccessToken });

    const emailController = new EmailController(oauth2Client);
    const messageId = req.params.id;

    const email = await emailController.getEmail(messageId);
    res.json(email);
  } catch (error) {
    console.error('Gmail API error:', error);
    res.status(500).json({ error: 'Failed to get email' });
  }
});




module.exports = emailRouter;