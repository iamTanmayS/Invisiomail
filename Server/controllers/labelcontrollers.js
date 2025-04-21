const { google } = require('googleapis');

class LabelController {
  constructor(auth) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async getLabels() {
    try {
      const response = await this.gmail.users.labels.list({ userId: 'me' });
      return response.data.labels || [];
    } catch (error) {
      console.error('Error getting labels:', error);
      throw error;
    }
  }

  async createLabel(name, options = {}) {
    try {
      const response = await this.gmail.users.labels.create({
        userId: 'me',
        resource: {
          name,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
          ...options
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating label:', error);
      throw error;
    }
  }

  async addLabel(messageId, labelId) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: { addLabelIds: [labelId] }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding label:', error);
      throw error;
    }
  }

  async removeLabel(messageId, labelId) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: { removeLabelIds: [labelId] }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing label:', error);
      throw error;
    }
  }
}

module.exports = LabelController;