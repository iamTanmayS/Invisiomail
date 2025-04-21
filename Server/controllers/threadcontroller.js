const { google } = require('googleapis');
const { parseMessage } = require('../utils/gmailutils');

class ThreadController {
  constructor(auth) {
    this.gmail = google.gmail({ version: 'v1', auth });
  }

  async listThreads(labelIds = ['INBOX'], query = '', pageToken = '', maxResults = 20) {
    try {
      const response = await this.gmail.users.threads.list({
        userId: 'me',
        labelIds: labelIds,
        q: query,
        maxResults: maxResults,
        pageToken: pageToken
      });

      const threads = response.data.threads || [];
      const nextPageToken = response.data.nextPageToken;

      const detailedThreads = await this.fetchThreadDetails(threads);

      return {
        threads: detailedThreads,
        nextPageToken: nextPageToken || ''
      };
    } catch (error) {
      console.error('Error listing threads:', error);
      throw error;
    }
  }

  async fetchThreadDetails(threads) {
    try {
      const detailedThreads = await Promise.all(
        threads.map(async (thread) => {
          const response = await this.gmail.users.threads.get({
            userId: 'me',
            id: thread.id,
            format: 'full'
          });
          return this.parseThreadDetails(response.data);
        })
      );
      return detailedThreads;
    } catch (error) {
      console.error('Error fetching thread details:', error);
      throw error;
    }
  }

  parseThreadDetails(thread) {
    const messages = thread.messages.map(message => parseMessage(message));
    const latestMessage = messages[messages.length - 1] || {};
    return {
      id: thread.id,
      messages,
      snippet: thread.snippet,
      subject: latestMessage.subject || '(No Subject)',
      from: latestMessage.from || '',
      date: latestMessage.date || '',
      isUnread: messages.some(msg => msg.isUnread),
      messageCount: messages.length
    };
  }

  async getThread(threadId) {
    try {
      const response = await this.gmail.users.threads.get({
        userId: 'me',
        id: threadId,
        format: 'full'
      });
      return this.parseThreadDetails(response.data);
    } catch (error) {
      console.error('Error getting thread:', error);
      throw error;
    }
  }
}

module.exports = ThreadController;