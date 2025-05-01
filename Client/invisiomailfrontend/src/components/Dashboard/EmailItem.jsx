import "../../Styles/Dashboard/DashboardStyles/EmailListItem.scss"

import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmailItem = ({ email, isSelected, onToggleSelection, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    // Animation variants
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: index * 0.05
            }
        },
        exit: {
            x: -20,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    // Format sender name to show only the display name
    const formatSenderName = (from) => {
        if (!from) return 'Unknown';
        // Extract name before email address
        const match = from.match(/^([^<]+)/);
        if (match) {
            return match[1].trim();
        }
        // If no match, remove email brackets and domain
        return from.replace(/<.*>/, '').replace(/[@].*/, '').trim();
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (date.getFullYear() === today.getFullYear()) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }

        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleEmailClick = (e) => {
        if (e.target.type === 'checkbox') return;
        navigate(`/email/${email.id}`);
    };

    const handleActionClick = (e) => {
        e.stopPropagation();
    };

    return (
        <motion.div
            className={`email-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${!email.read ? 'unread' : ''}`}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleEmailClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            layout
        >
            <div className="email-actions" onClick={handleActionClick}>
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelection();
                        }}
                    />
                    <span className="checkmark"></span>
                </label>

                <button className="star-button" aria-label="Star this message">
                    <svg className={`star-icon ${email.starred ? 'starred' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={email.starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            </div>

            <div className="email-sender">
                <span className="sender-name">{formatSenderName(email.from)}</span>
            </div>

            <div className="email-content">
                <span className="email-subject">{email.subject || 'No Subject'}</span>
            </div>

            <div className="email-meta">
                {email.hasAttachments && (
                    <span className="attachment-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path>
                        </svg>
                    </span>
                )}
                <span className="email-date">{formatDate(email.date)}</span>
            </div>

            <div className="hover-actions">
                <button className="hover-action-button" aria-label="Archive">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="21 8 21 21 3 21 3 8"></polyline>
                        <rect x="1" y="3" width="22" height="5"></rect>
                        <line x1="10" y1="12" x2="14" y2="12"></line>
                    </svg>
                </button>
                <button className="hover-action-button" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
                <button className="hover-action-button" aria-label="Mark as unread">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </button>
            </div>
        </motion.div>
    );
};

export default EmailItem;