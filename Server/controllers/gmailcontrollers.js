// Gmail API Controllers
// This file contains the controllers for interacting with the Gmail API
// to perform various operations like listing emails, sending emails, and managing drafts.

// Make sure to include the Google API Client Library and set up authentication
// before using these controllers.



class EmailController {
    constructor() {
      this.pageToken = '';
      this.maxResults = 20;
    }
  
    /**
     * List emails in the user's inbox
     * @param {string} labelIds - Label IDs to filter by (e.g., 'INBOX', 'UNREAD')
     * @param {string} query - Search query
     * @returns {Promise<Array>} - List of messages
     */
    async listEmails(labelIds = ['INBOX'], query = '') {
      try {
        const response = await gapi.client.gmail.users.messages.list({
          userId: 'me',
          labelIds: labelIds,
          q: query,
          maxResults: this.maxResults,
          pageToken: this.pageToken || ''
        });
        
        this.pageToken = response.result.nextPageToken;
        
        if (!response.result.messages) {
          return [];
        }
        
        return await this.fetchEmailDetails(response.result.messages);
      } catch (error) {
        console.error('Error listing emails:', error);
        throw error;
      }
    }
    
    /**
     * Load more emails (for pagination)
     * @param {string} labelIds - Label IDs to filter by
     * @param {string} query - Search query
     * @returns {Promise<Array>} - Additional messages
     */
    async loadMoreEmails(labelIds = ['INBOX'], query = '') {
      if (!this.pageToken) {
        return [];
      }
      return await this.listEmails(labelIds, query);
    }
  
    /**
     * Fetch detailed information for each email
     * @param {Array} messages - List of message objects with IDs
     * @returns {Promise<Array>} - Detailed message objects
     */
    async fetchEmailDetails(messages) {
      try {
        const detailedMessages = await Promise.all(
          messages.map(async (message) => {
            const response = await gapi.client.gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full'
            });
            return this.parseMessage(response.result);
          })
        );
        return detailedMessages;
      } catch (error) {
        console.error('Error fetching email details:', error);
        throw error;
      }
    }
  
    /**
     * Parse raw message into a more usable format
     * @param {Object} message - Raw message object from Gmail API
     * @returns {Object} - Parsed message
     */
    parseMessage(message) {
      const headers = message.payload.headers;
      const subject = this.getHeader(headers, 'Subject') || '(No Subject)';
      const from = this.getHeader(headers, 'From') || '';
      const to = this.getHeader(headers, 'To') || '';
      const date = this.getHeader(headers, 'Date') || '';
      
      let body = '';
      if (message.payload.parts) {
        // Multi-part message
        body = this.getMessageBody(message.payload.parts);
      } else if (message.payload.body && message.payload.body.data) {
        // Single-part message
        body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      }
      
      return {
        id: message.id,
        threadId: message.threadId,
        snippet: message.snippet,
        subject,
        from,
        to,
        date,
        body,
        labelIds: message.labelIds,
        isUnread: message.labelIds && message.labelIds.includes('UNREAD')
      };
    }
  
    /**
     * Extract message body from message parts
     * @param {Array} parts - Message parts 
     * @returns {string} - Message body text
     */
    getMessageBody(parts) {
      let result = '';
      
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          result = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          break;
        } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
          const html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          const div = document.createElement('div');
          div.innerHTML = html;
          result = div.textContent || div.innerText || '';
          break;
        } else if (part.parts) {
          result = this.getMessageBody(part.parts);
          if (result) break;
        }
      }
      
      return result;
    }
  
    /**
     * Get header value by name
     * @param {Array} headers - Message headers array
     * @param {string} name - Header name to find
     * @returns {string} - Header value
     */
    getHeader(headers, name) {
      const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
      return header ? header.value : '';
    }
  
    /**
     * Get a specific email by ID
     * @param {string} messageId - Email message ID
     * @returns {Promise<Object>} - Detailed message object
     */
    async getEmail(messageId) {
      try {
        const response = await gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: messageId,
          format: 'full'
        });
        
        return this.parseMessage(response.result);
      } catch (error) {
        console.error('Error getting email:', error);
        throw error;
      }
    }
  
    /**
     * Mark email as read
     * @param {string} messageId - Email message ID
     * @returns {Promise<Object>} - API response
     */
    async markAsRead(messageId) {
      try {
        return await gapi.client.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            removeLabelIds: ['UNREAD']
          }
        });
      } catch (error) {
        console.error('Error marking email as read:', error);
        throw error;
      }
    }
  
    /**
     * Mark email as unread
     * @param {string} messageId - Email message ID
     * @returns {Promise<Object>} - API response
     */
    async markAsUnread(messageId) {
      try {
        return await gapi.client.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            addLabelIds: ['UNREAD']
          }
        });
      } catch (error) {
        console.error('Error marking email as unread:', error);
        throw error;
      }
    }
  
    /**
     * Archive email (remove from inbox)
     * @param {string} messageId - Email message ID
     * @returns {Promise<Object>} - API response
     */
    async archiveEmail(messageId) {
      try {
        return await gapi.client.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            removeLabelIds: ['INBOX']
          }
        });
      } catch (error) {
        console.error('Error archiving email:', error);
        throw error;
      }
    }
  
    /**
     * Trash email
     * @param {string} messageId - Email message ID
     * @returns {Promise<Object>} - API response
     */
    async trashEmail(messageId) {
      try {
        return await gapi.client.gmail.users.messages.trash({
          userId: 'me',
          id: messageId
        });
      } catch (error) {
        console.error('Error trashing email:', error);
        throw error;
      }
    }
  }
  
  /**
   * Compose Controller - Handles sending emails and managing drafts
   */
  class ComposeController {
    /**
     * Convert email content to RFC 2822 formatted base64 string
     * @param {Object} emailData - Email content and metadata
     * @returns {string} - Base64 encoded email
     */
    createEmailRaw(emailData) {
      const { to, subject, body, cc = '', bcc = '' } = emailData;
      
      let email = '';
      
      // Add headers
      email += `To: ${to}\r\n`;
      if (cc) email += `Cc: ${cc}\r\n`;
      if (bcc) email += `Bcc: ${bcc}\r\n`;
      email += `Subject: ${subject}\r\n`;
      email += 'Content-Type: text/plain; charset=utf-8\r\n';
      email += 'MIME-Version: 1.0\r\n\r\n';
      
      // Add body
      email += body;
      
      // Convert to base64url format
      return btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    /**
     * Send an email
     * @param {Object} emailData - Email content and metadata
     * @returns {Promise<Object>} - API response
     */
    async sendEmail(emailData) {
      try {
        const raw = this.createEmailRaw(emailData);
        
        const response = await gapi.client.gmail.users.messages.send({
          userId: 'me',
          resource: {
            raw: raw
          }
        });
        
        return response.result;
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
    }
  
    /**
     * Create a draft email
     * @param {Object} emailData - Email content and metadata
     * @returns {Promise<Object>} - API response with draft ID
     */
    async createDraft(emailData) {
      try {
        const raw = this.createEmailRaw(emailData);
        
        const response = await gapi.client.gmail.users.drafts.create({
          userId: 'me',
          resource: {
            message: {
              raw: raw
            }
          }
        });
        
        return response.result;
      } catch (error) {
        console.error('Error creating draft:', error);
        throw error;
      }
    }
  
    /**
     * List all draft emails
     * @returns {Promise<Array>} - List of drafts
     */
    async listDrafts() {
      try {
        const response = await gapi.client.gmail.users.drafts.list({
          userId: 'me',
          maxResults: 50
        });
        
        if (!response.result.drafts) {
          return [];
        }
        
        return await this.fetchDraftDetails(response.result.drafts);
      } catch (error) {
        console.error('Error listing drafts:', error);
        throw error;
      }
    }
  
    /**
     * Fetch detailed information for each draft
     * @param {Array} drafts - List of draft objects with IDs
     * @returns {Promise<Array>} - Detailed draft objects
     */
    async fetchDraftDetails(drafts) {
      try {
        const detailedDrafts = await Promise.all(
          drafts.map(async (draft) => {
            const response = await gapi.client.gmail.users.drafts.get({
              userId: 'me',
              id: draft.id,
              format: 'full'
            });
            
            const message = response.result.message;
            const emailController = new EmailController();
            const parsedMessage = emailController.parseMessage(message);
            
            return {
              id: draft.id,
              message: parsedMessage
            };
          })
        );
        
        return detailedDrafts;
      } catch (error) {
        console.error('Error fetching draft details:', error);
        throw error;
      }
    }
  
    /**
     * Get a specific draft by ID
     * @param {string} draftId - Draft ID
     * @returns {Promise<Object>} - Detailed draft object
     */
    async getDraft(draftId) {
      try {
        const response = await gapi.client.gmail.users.drafts.get({
          userId: 'me',
          id: draftId,
          format: 'full'
        });
        
        const message = response.result.message;
        const emailController = new EmailController();
        const parsedMessage = emailController.parseMessage(message);
        
        return {
          id: response.result.id,
          message: parsedMessage
        };
      } catch (error) {
        console.error('Error getting draft:', error);
        throw error;
      }
    }
  
    /**
     * Update an existing draft
     * @param {string} draftId - Draft ID
     * @param {Object} emailData - Updated email content and metadata
     * @returns {Promise<Object>} - API response
     */
    async updateDraft(draftId, emailData) {
      try {
        const raw = this.createEmailRaw(emailData);
        
        const response = await gapi.client.gmail.users.drafts.update({
          userId: 'me',
          id: draftId,
          resource: {
            message: {
              raw: raw
            }
          }
        });
        
        return response.result;
      } catch (error) {
        console.error('Error updating draft:', error);
        throw error;
      }
    }
  
    /**
     * Send a draft email
     * @param {string} draftId - Draft ID 
     * @returns {Promise<Object>} - API response
     */
    async sendDraft(draftId) {
      try {
        const response = await gapi.client.gmail.users.drafts.send({
          userId: 'me',
          resource: {
            id: draftId
          }
        });
        
        return response.result;
      } catch (error) {
        console.error('Error sending draft:', error);
        throw error;
      }
    }
  
    /**
     * Delete a draft
     * @param {string} draftId - Draft ID
     * @returns {Promise<void>}
     */
    async deleteDraft(draftId) {
      try {
        await gapi.client.gmail.users.drafts.delete({
          userId: 'me',
          id: draftId
        });
      } catch (error) {
        console.error('Error deleting draft:', error);
        throw error;
      }
    }
  }
  
  /**
   * Label Controller - Handles Gmail label operations
   */
  class LabelController {
    /**
     * Get all labels for the user
     * @returns {Promise<Array>} - List of labels
     */
    async getLabels() {
      try {
        const response = await gapi.client.gmail.users.labels.list({
          userId: 'me'
        });
        
        return response.result.labels || [];
      } catch (error) {
        console.error('Error getting labels:', error);
        throw error;
      }
    }
  
    /**
     * Create a new label
     * @param {string} name - Label name
     * @param {Object} options - Label options (color, etc.)
     * @returns {Promise<Object>} - Created label
     */
    async createLabel(name, options = {}) {
      try {
        const response = await gapi.client.gmail.users.labels.create({
          userId: 'me',
          resource: {
            name,
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show',
            ...options
          }
        });
        
        return response.result;
      } catch (error) {
        console.error('Error creating label:', error);
        throw error;
      }
    }
  
    /**
     * Apply a label to an email
     * @param {string} messageId - Email message ID
     * @param {string} labelId - Label ID to apply
     * @returns {Promise<Object>} - API response
     */
    async addLabel(messageId, labelId) {
      try {
        return await gapi.client.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            addLabelIds: [labelId]
          }
        });
      } catch (error) {
        console.error('Error adding label:', error);
        throw error;
      }
    }
  
    /**
     * Remove a label from an email
     * @param {string} messageId - Email message ID
     * @param {string} labelId - Label ID to remove
     * @returns {Promise<Object>} - API response
     */
    async removeLabel(messageId, labelId) {
      try {
        return await gapi.client.gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            removeLabelIds: [labelId]
          }
        });
      } catch (error) {
        console.error('Error removing label:', error);
        throw error;
      }
    }
  }
  
  /**
   * Thread Controller - Handles Gmail thread operations
   */
  class ThreadController {
    /**
     * List email threads
     * @param {string} labelIds - Label IDs to filter by
     * @param {string} query - Search query
     * @returns {Promise<Array>} - List of threads
     */
    async listThreads(labelIds = ['INBOX'], query = '') {
      try {
        const response = await gapi.client.gmail.users.threads.list({
          userId: 'me',
          labelIds: labelIds,
          q: query,
          maxResults: 20
        });
        
        if (!response.result.threads) {
          return [];
        }
        
        return await this.fetchThreadDetails(response.result.threads);
      } catch (error) {
        console.error('Error listing threads:', error);
        throw error;
      }
    }
  
    /**
     * Fetch detailed information for each thread
     * @param {Array} threads - List of thread objects with IDs
     * @returns {Promise<Array>} - Detailed thread objects
     */
    async fetchThreadDetails(threads) {
      try {
        const detailedThreads = await Promise.all(
          threads.map(async (thread) => {
            const response = await gapi.client.gmail.users.threads.get({
              userId: 'me',
              id: thread.id
            });
            
            return this.parseThreadDetails(response.result);
          })
        );
        
        return detailedThreads;
      } catch (error) {
        console.error('Error fetching thread details:', error);
        throw error;
      }
    }
  
    /**
     * Parse thread data into a more usable format
     * @param {Object} thread - Raw thread object from Gmail API
     * @returns {Object} - Parsed thread data
     */
    parseThreadDetails(thread) {
      const emailController = new EmailController();
      const messages = thread.messages.map(message => emailController.parseMessage(message));
      
      // Get the latest message for thread summary
      const latestMessage = messages[messages.length - 1];
      
      return {
        id: thread.id,
        messages: messages,
        snippet: thread.snippet,
        subject: latestMessage.subject,
        from: latestMessage.from,
        date: latestMessage.date,
        isUnread: thread.messages.some(msg => msg.labelIds && msg.labelIds.includes('UNREAD')),
        messageCount: messages.length
      };
    }
  
    /**
     * Get a specific thread by ID
     * @param {string} threadId - Thread ID
     * @returns {Promise<Object>} - Detailed thread object
     */
    async getThread(threadId) {
      try {
        const response = await gapi.client.gmail.users.threads.get({
          userId: 'me',
          id: threadId
        });
        
        return this.parseThreadDetails(response.result);
      } catch (error) {
        console.error('Error getting thread:', error);
        throw error;
      }
    }
  }
  
  // Export all controllers
  export {
    AuthController,
    EmailController,
    ComposeController,
    LabelController,
    ThreadController
  };