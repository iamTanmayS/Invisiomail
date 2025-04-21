const { google } = require('googleapis');
const { parseMessage } = require('../utils/gmailutils');

class ComposeController {
  constructor(auth) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  createEmailRaw(emailData) {
    const { to, subject, body, cc = '', bcc = '' } = emailData;
    let email = '';

    email += `To: ${to}\r\n`;
    if (cc) email += `Cc: ${cc}\r\n`;
    if (bcc) email += `Bcc: ${bcc}\r\n`;
    email += `Subject: ${subject}\r\n`;
    email += 'Content-Type: text/plain; charset=utf-8\r\n';
    email += 'MIME-Version: 1.0\r\n\r\n';
    email += body;

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async sendEmail(emailData) {
    try {
      const raw = this.createEmailRaw(emailData);
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        resource: { raw }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async createDraft(emailData) {
    try {
      const raw = this.createEmailRaw(emailData);
      const response = await this.gmail.users.drafts.create({
        userId: 'me',
        resource: { message: { raw } }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating draft:', error);
      throw error;
    }
  }

  async listDrafts(maxResults = 50) {
    try {
      const response = await this.gmail.users.drafts.list({
        userId: 'me',
        maxResults
      });
      const drafts = response.data.drafts || [];
      return await this.fetchDraftDetails(drafts);
    } catch (error) {
      console.error('Error listing drafts:', error);
      throw error;
    }
  }

  async fetchDraftDetails(drafts) {
    try {
      const detailedDrafts = await Promise.all(
        drafts.map(async (draft) => {
          const response = await this.gmail.users.drafts.get({
            userId: 'me',
            id: draft.id,
            format: 'full'
          });
          const message = parseMessage(response.data.message);
          return { id: draft.id, message };
        })
      );
      return detailedDrafts;
    } catch (error) {
      console.error('Error fetching draft details:', error);
      throw error;
    }
  }

  async getDraft(draftId) {
    try {
      const response = await this.gmail.users.drafts.get({
        userId: 'me',
        id: draftId,
        format: 'full'
      });
      const message = parseMessage(response.data.message);
      return { id: response.data.id, message };
    } catch (error) {
      console.error('Error getting draft:', error);
      throw error;
    }
  }

  async updateDraft(draftId, emailData) {
    try {
      const raw = this.createEmailRaw(emailData);
      const response = await this.gmail.users.drafts.update({
        userId: 'me',
        id: draftId,
        resource: { message: { raw } }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  }

  async sendDraft(draftId) {
    try {
      const response = await this.gmail.users.drafts.send({
        userId: 'me',
        resource: { id: draftId }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending draft:', error);
      throw error;
    }
  }

  async deleteDraft(draftId) {
    try {
      await this.gmail.users.drafts.delete({
        userId: 'me',
        id: draftId
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  }
}

module.exports = ComposeController;