import "../../Styles/Dashboard/DashboardStyles/EmailList.scss"

import { AnimatePresence, motion } from 'framer-motion';

import EmailItem from './EmailItem';
import EmailListHeader from './EmailListHeader';
import NoEmails from './NoEmails';
import React from 'react';

const EmailList = ({ emails, selectedEmails, onToggleSelection }) => {
    // Animation variants for container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    return (
        <div className="email-list-wrapper">
            <EmailListHeader />

            <AnimatePresence mode="wait">
                {emails.length > 0 ? (
                    <motion.div
                        className="email-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {emails.map((email, index) => (
                            <EmailItem
                                key={email.id || index}
                                email={email}
                                isSelected={selectedEmails.includes(email.id)}
                                onToggleSelection={() => onToggleSelection(email.id)}
                                index={index}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <NoEmails />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmailList;