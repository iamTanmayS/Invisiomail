const { google } = require('googleapis');
const { parseMessage } = require('../utils/gmailutils');

class EmailController {
  constructor(auth) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async listEmails(labelIds = ['INBOX'], query = '', pageToken = '', maxResults = 20) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        labelIds: labelIds,
        q: query,
        maxResults: maxResults,
        pageToken: pageToken
      });

      const messages = response.data.messages || [];
      const nextPageToken = response.data.nextPageToken;

      const detailedMessages = await this.fetchEmailDetails(messages);

      return {
        messages: detailedMessages,
        nextPageToken: nextPageToken || ''
      };
    } catch (error) {
      console.error('Error listing emails:', error);
      throw error;
    }
  }

  async fetchEmailDetails(messages) {
    try {
      const detailedMessages = await Promise.all(
        messages.map(async (message) => {
          const response = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });
          return parseMessage(response.data);
        })
      );
      return detailedMessages;
    } catch (error) {
      console.error('Error fetching email details:', error);
      throw error;
    }
  }

  async getEmail(messageId) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });
      return parseMessage(response.data);
    } catch (error) {
      console.error('Error getting email:', error);
      throw error;
    }
  }

  async markAsRead(messageId) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: {
          removeLabelIds: ['UNREAD']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw error;
    }
  }

  async markAsUnread(messageId) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: {
          addLabelIds: ['UNREAD']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error marking email as unread:', error);
      throw error;
    }
  }

  async archiveEmail(messageId) {
    try {
      const response = await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: {
          removeLabelIds: ['INBOX']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error archiving email:', error);
      throw error;
    }
  }

  async trashEmail(messageId) {
    try {
      const response = await this.gmail.users.messages.trash({
        userId: 'me',
        id: messageId
      });
      return response.data;
    } catch (error) {
      console.error('Error trashing email:', error);
      throw error;
    }
  }
}

module.exports = EmailController;