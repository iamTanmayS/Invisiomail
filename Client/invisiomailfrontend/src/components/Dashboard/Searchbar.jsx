import '../../Styles/Dashboard/DashboardStyles/SearchBar.scss';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef(null);

    // Handle search query changes
    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    // Clear search
    const clearSearch = () => {
        setQuery('');
        onSearch('');
        searchInputRef.current.focus();
    };

    // Handle keyboard shortcut (/ to focus search)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/' && !isFocused) {
                e.preventDefault();
                searchInputRef.current.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFocused]);

    return (
        <motion.div
            className={`search-bar-container ${isFocused ? 'focused' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>

                <input
                    ref={searchInputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search in emails"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    aria-label="Search emails"
                />

                <AnimatePresence>
                    {query && (
                        <motion.button
                            className="clear-button"
                            onClick={clearSearch}
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            aria-label="Clear search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="search-shortcuts">
                    <kbd>/</kbd>
                </div>
            </form>
        </motion.div>
    );
};

export default SearchBar;