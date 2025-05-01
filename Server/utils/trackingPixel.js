
/**
 * Attaches an invisible tracking pixel to an email body
 * @param {string} emailBody - The original email body
 * @param {string} messageId - The unique ID for the email
 * @returns {string} The email body with the tracking pixel attached
 */
const attachTrackingPixelToBody = (emailBody, messageId) => {
  const uniqueParam = Date.now();
  const trackingUrl = `https://sapphire-vt-msgstr-charge.trycloudflare.com/track/${messageId}?t=${uniqueParam}`;
  
  // Create the tracking pixel HTML
  const trackingPixelHtml = `<img src="${trackingUrl}" width="143" height="143" alt="Tracking Pixel" loading="eager" />`;
  
  let finalBody = emailBody.trim();
  
  // Check for HTML structure
  const hasHtml = finalBody.toLowerCase().includes('</html>');
  const hasBody = finalBody.toLowerCase().includes('</body>');
  
  if (!hasHtml && !hasBody) {
    // No HTML structure - wrap the content in HTML and body tags
    finalBody = `<html><body>${finalBody}${trackingPixelHtml}</body></html>`;
  } else if (!hasBody && hasHtml) {
    // Has HTML but no body - insert body tags
    finalBody = finalBody.replace(/<html>/i, '<html><body>');
    finalBody = finalBody.replace(/<\/html>/i, `${trackingPixelHtml}</body></html>`);
  } else if (hasBody) {
    // Has body tag - insert before closing body tag
    finalBody = finalBody.replace(/<\/body>/i, `${trackingPixelHtml}</body>`);
  }
  
  // Ensure proper HTML structure
  if (!finalBody.toLowerCase().includes('<html>')) {
    finalBody = `<html>${finalBody}</html>`;
  }
  
  return finalBody;
};

module.exports = attachTrackingPixelToBody;
