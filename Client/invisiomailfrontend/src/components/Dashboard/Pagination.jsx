import '../../Styles/Dashboard/DashboardStyles/Pagination.scss';

import React from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, hasNext, hasPrev, onNextPage, onPrevPage }) => {
    return (
        <motion.div
            className="pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
        >
            <button
                className={`pagination-button ${!hasPrev ? 'disabled' : ''}`}
                onClick={onPrevPage}
                disabled={!hasPrev}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span>Previous</span>
            </button>

            <div className="pagination-info">
                <span className="page-number">Page {currentPage}</span>
            </div>

            <button
                className={`pagination-button ${!hasNext ? 'disabled' : ''}`}
                onClick={onNextPage}
                disabled={!hasNext}
            >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </motion.div>
    );
};

export default Pagination;