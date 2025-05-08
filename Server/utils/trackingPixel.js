
/**
 * @param {string} emailBody - The original email body
 * @param {string} messageId - The unique ID for the email
 * @returns {string} The email body with the tracking pixel attached
 */

const attachTrackingPixelToBody = (emailBody, messageId) => {
  const uniqueParam = Date.now();
  const trackingUrl = `https://became-nigeria-pages-designed.trycloudflare.com/${messageId}?t=${uniqueParam}`;
  

  const trackingPixelHtml = `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:None" loading="eager" />`;
  
  let finalBody = emailBody.trim();
  
  
  const hasHtml = finalBody.toLowerCase().includes('</html>');
  const hasBody = finalBody.toLowerCase().includes('</body>');
  
  if (!hasHtml && !hasBody) {
    
    finalBody = `<html><body>${finalBody}${trackingPixelHtml}</body></html>`;
  } else if (!hasBody && hasHtml) {
    
    finalBody = finalBody.replace(/<html>/i, '<html><body>');
    finalBody = finalBody.replace(/<\/html>/i, `${trackingPixelHtml}</body></html>`);
  } else if (hasBody) {
   
    finalBody = finalBody.replace(/<\/body>/i, `${trackingPixelHtml}</body>`);
  }
  

  if (!finalBody.toLowerCase().includes('<html>')) {
    finalBody = `<html>${finalBody}</html>`;
  }
  
  return finalBody;
};

module.exports = attachTrackingPixelToBody;
