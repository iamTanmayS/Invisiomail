import '../Styles/Pages/EmailContentView.css';

import React, { useEffect, useRef, useState } from 'react';

import DOMPurify from 'dompurify';
import { fetchemailcontent } from '../Api/EmailsFunctions';
import { motion } from "framer-motion";
import parse from 'html-react-parser';
import { useParams } from "react-router-dom";

function EmailContentView() {
  const { emailId } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bodyContainerRef = useRef(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        const response = await fetchemailcontent(emailId);
        const emailContent = await response.json();
        setEmail(emailContent);
        console.log(emailContent);
      } catch (err) {
        console.error("Error fetching email content:", err);
        setError("Failed to load email content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [emailId]);

  const isHTML = (content) => {
    if (!content) return false;
    return /<[a-z][\s\S]*>/i.test(content);
  };

  const renderEmailContent = () => {
    if (!email?.body) return null;

    if (isHTML(email.body)) {
      // Configure DOMPurify to allow certain tags
      const cleanHtml = DOMPurify.sanitize(email.body, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      });

      // Custom options for html-react-parser
      const options = {
        replace: (domNode) => {
          // Handle image loading and processing
          if (domNode.name === 'img') {
            const { src, alt, width, height, style, className } = domNode.attribs;
            return (
              <motion.img
                src={src}
                alt={alt || 'Email image'}
                width={width}
                height={height}
                style={style}
                className={`email-image ${className || ''}`}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/broken-image.png'; // Fallback image
                  e.target.style.opacity = 0.7;
                }}
              />
            );
          }

          // Handle anchor links to open in new tab
          if (domNode.name === 'a' && domNode.attribs?.href) {
            return (
              <a
                href={domNode.attribs.href}
                target="_blank"
                rel="noopener noreferrer"
                className="email-link"
              >
                {domNode.children.map(child =>
                  child.type === 'text' ? child.data : null
                )}
              </a>
            );
          }
        }
      };

      return <div className="email-html-content">{parse(cleanHtml, options)}</div>;
    } else {
      // Convert plain text to HTML with line breaks
      const textWithLineBreaks = email.body
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />');

      // Check for URLs and make them clickable
      const textWithLinks = textWithLineBreaks.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="email-link">$1</a>'
      );

      return (
        <div
          className="email-text-content"
          dangerouslySetInnerHTML={{ __html: `<p>${textWithLinks}</p>` }}
        />
      );
    }
  };

  // Scroll to top when email changes
  useEffect(() => {
    if (bodyContainerRef.current && !loading) {
      bodyContainerRef.current.scrollTop = 0;
    }
  }, [email, loading]);

  if (loading) {
    return (
      <motion.div
        className="email-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-spinner"></div>
        <p>Loading email...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="email-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!email) {
    return (
      <motion.div
        className="email-not-found"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>Email not found or has been deleted.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="email-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="email-header">
        <motion.h1
          className="email-subject"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {email.subject || "No Subject"}
        </motion.h1>

        <motion.div
          className="email-metadata"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="sender-info">
            <span className="from-label">From:</span>
            <span className="from-value">{email.from || "Unknown Sender"}</span>
          </div>

          <div className="receiver-info">
            <span className="to-label">To:</span>
            <span className="to-value">{email.to || "Unknown Recipient"}</span>
          </div>

          {email.date && (
            <div className="date-info">
              <span className="date-label">Date:</span>
              <span className="date-value">{new Date(email.date).toLocaleString()}</span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="email-body-container"
        ref={bodyContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="email-body">
          {renderEmailContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default EmailContentView;