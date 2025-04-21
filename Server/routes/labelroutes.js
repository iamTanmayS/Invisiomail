const { google } = require('googleapis');
const LabelController = require('../controllers/labelcontrollers')
const verifyToken = require('../middleware/authmiddleware');
const express = require('express');
const labelRouter = express.Router()
const User = require("../database/models/userModel")


labelRouter.get('/labels', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const labelController = new LabelController(oauth2Client);
      const labels = await labelController.getLabels();
  
      res.json(labels);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to get labels' });
    }
  });


  router.post('/labels', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const labelController = new LabelController(oauth2Client);
      const { name, options } = req.body;
  
      const label = await labelController.createLabel(name, options);
      res.json(label);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to create label' });
    }
  });





  router.post('/emails/:id/labels', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const labelController = new LabelController(oauth2Client);
      const messageId = req.params.id;
      const { labelId } = req.body;
  
      const result = await labelController.addLabel(messageId, labelId);
      res.json(result);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to add label' });
    }
  });



  router.delete('/emails/:id/labels/:labelId', verifyToken, async (req, res) => {
    try {
      const userId = req.user.googleId;
      const user = await User.findOne({ googleId: userId });
      if (!user || !user.googleAccessToken) {
        return res.status(401).json({ error: 'No Google token found' });
      }
  
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: user.googleAccessToken });
  
      const labelController = new LabelController(oauth2Client);
      const messageId = req.params.id;
      const labelId = req.params.labelId;
  
      const result = await labelController.removeLabel(messageId, labelId);
      res.json(result);
    } catch (error) {
      console.error('Gmail API error:', error);
      res.status(500).json({ error: 'Failed to remove label' });
    }
  });


module.exports = labelRouter;
