
const ComposeController = require('../controllers/composecontroller');
const Email = require('../database/models/emailModel');
const attachTrackingPixelToBody = require('../utils/trackingPixel');
const path = require('path');
const fs = require('fs');

class TrackandUpdateMailController {
  async sendAndSave(req, res) {
    const { to, subject, body, cc = '', bcc = '' } = req.body;
    const oauth2Client = req.oauth2Client;

    if (!to || !subject || !body) {
      return res.status(400).json({ success: false, message: 'To, Subject, and Body are required.' });
    }

    try {
      const newEmail = new Email({
        user: req.user._id,
        sender: req.user.email,
        receiver: to,
        subject: subject,
        body: body, 
        status: 'sent',
        sentAt: new Date(),
      });
      await newEmail.save();
      
      // Add tracking pixel with the email ID
      const bodyWithPixel = attachTrackingPixelToBody(body, newEmail._id.toString());
      const emailData = { to, subject, body: bodyWithPixel, cc, bcc };

      const composeController = new ComposeController(oauth2Client);
      const gmailResponse = await composeController.sendEmail(emailData);

      // Update record with the modified body and Gmail message ID
      newEmail.body = bodyWithPixel;       
      newEmail.messageId = gmailResponse.id;
      await newEmail.save();
      
      console.log('Email sent and saved successfully.');
      return res.status(200).json({
        success: true,
        message: 'Email sent and saved successfully.',
        email: newEmail,
      });

    } catch (error) {
      console.error('Failed to send or save email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email.',
        error: error.message,
      });
    }
  }

  async trackEmail(req, res) {
    try {
      // Set CORS headers to allow the image to load in emails
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      const emailId = req.params.id;
      
      if (!emailId) {
        console.error('No email ID provided');
        return this.sendTransparentPixel(res);
      }

      // Update email record
      const updatedEmail = await Email.findByIdAndUpdate(
        emailId,
        {
          $set: { 
            readStatus: 'opened', 
            openedAt: new Date() 
          },
          $inc: { openCount: 1 }
        },
        { new: true }
      );

      if (!updatedEmail) {
        console.log(`No email found with ID: ${emailId}`);
      } else {
        console.log(`Email ${emailId} tracked - opened at ${updatedEmail.openedAt}`);
      }

      // Return transparent pixel
      this.sendTransparentPixel(res);

    } catch (error) {
      console.error('Tracking pixel error:', error);
      // Always send the pixel even if tracking fails
      this.sendTransparentPixel(res);
    }
  }

  // Helper method to send transparent pixel
  sendTransparentPixel(res) {
    const transparentPixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': transparentPixel.length,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    res.end(transparentPixel);
  }
}

const controller = new TrackandUpdateMailController();

module.exports = {
  sendAndSave: controller.sendAndSave.bind(controller),
  trackEmail: controller.trackEmail.bind(controller)
};
