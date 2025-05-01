import "../../Styles/Dashboard/DashboardStyles/NoEmails.scss"

import React from 'react';
import { motion } from 'framer-motion';

const NoEmails = () => {
    return (
        <motion.div
            className="no-emails"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
            <motion.div
                className="no-emails-icon"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 13V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9"></path>
                    <path d="M18 2v4"></path>
                    <path d="M6 2v4"></path>
                    <path d="M2 10h20"></path>
                    <circle cx="18" cy="18" r="3"></circle>
                    <path d="M18 14.5V18l1.5 1.5"></path>
                </svg>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                No emails found
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                Your inbox is empty or no results match your search.
            </motion.p>

            <motion.button
                className="refresh-button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Refresh
            </motion.button>
        </motion.div>
    );
};

export default NoEmails;