const { htmlToText } = require('html-to-text');

function parseMessage(message) {
  const headers = message.payload.headers || [];
  const subject = getHeader(headers, 'Subject') || '(No Subject)';
  const from = getHeader(headers, 'From') || '';
  const to = getHeader(headers, 'To') || '';
  const date = getHeader(headers, 'Date') || '';

  let body = '';
  if (message.payload.parts) {
    body = getMessageBody(message.payload.parts);
  } else if (message.payload.body && message.payload.body.data) {
    body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
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

function getMessageBody(parts) {
  for (const part of parts) {
    if (part.mimeType === 'text/plain' && part.body && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8');
    } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
      const html = Buffer.from(part.body.data, 'base64').toString('utf-8');
      return htmlToText(html);
    } else if (part.parts) {
      const body = getMessageBody(part.parts);
      if (body) return body;
    }
  }
  return '';
}

function getHeader(headers, name) {
  const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
}

module.exports = { parseMessage, getMessageBody, getHeader };