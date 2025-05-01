import '../../Styles/Dashboard/DashboardStyles/EmailListHeader.scss';

import { AnimatePresence, motion } from 'framer-motion';
import {
    FiAlignLeft,
    FiChevronDown,
    FiFilter,
    FiList,
    FiMinus,
    FiRefreshCw
} from 'react-icons/fi';
import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

// Import desired icons from react-icons


// Import styles


// Helper Hook for detecting clicks outside an element (same as before)
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const EmailListHeader = ({
    // --- Props for controlling state and handling actions ---
    selectedEmailsCount = 0,
    totalEmailsCount = 0,
    isAllSelected = false,
    currentSort = 'newest',
    currentView = 'default',
    sortOptions = [ // Default simple sort options
        { id: 'newest', label: 'Newest' },
        { id: 'oldest', label: 'Oldest' },
        { id: 'unread', label: 'Unread' },
    ],
    // Keep select options simple and standard
    selectOptions = [
        { id: 'all', label: 'All' },
        { id: 'none', label: 'None' },
        { id: 'read', label: 'Read' },
        { id: 'unread', label: 'Unread' },
    ],
    onSelectChange,
    onRefresh,
    onSortChange,
    onViewChange,
}) => {
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);

    const sortDropdownRef = useRef(null);
    const selectDropdownRef = useRef(null);

    useClickOutside(sortDropdownRef, () => setShowSortDropdown(false));
    useClickOutside(selectDropdownRef, () => setShowSelectDropdown(false));

    const handleMasterCheckboxChange = (event) => {
        if (onSelectChange) {
            onSelectChange(event.target.checked ? 'all' : 'none');
        }
    };

    const handleSelectOptionClick = (optionId) => {
        if (onSelectChange) {
            onSelectChange(optionId);
        }
        setShowSelectDropdown(false);
    };

    const handleSortOptionClick = (optionId) => {
        if (onSortChange) {
            onSortChange(optionId);
        }
        setShowSortDropdown(false);
    };

    const handleViewOptionClick = (viewId) => {
        if (onViewChange) {
            onViewChange(viewId);
        }
    };

    const getSelectedSortLabel = () => {
        const selected = sortOptions.find(opt => opt.id === currentSort);
        return selected ? selected.label : 'Sort';
    };

    // Determine checkbox state: checked, indeterminate, or unchecked
    const getCheckboxState = () => {
        // Ensure totalEmailsCount is valid and greater than 0 before calculating 'all selected'
        const canSelectAll = totalEmailsCount > 0;
        if (isAllSelected && selectedEmailsCount === totalEmailsCount && canSelectAll) return 'checked';
        if (selectedEmailsCount > 0) return 'indeterminate';
        return 'unchecked';
    }
    const checkboxState = getCheckboxState();


    return (
        <div className="email-list-header">
            <div className="header-left">
                {/* --- Select All Checkbox & Dropdown --- */}
                <div className="select-control" ref={selectDropdownRef}>
                    <label className="checkbox-container" title={checkboxState === 'checked' ? "Deselect all" : "Select all"}>
                        <input
                            type="checkbox"
                            checked={checkboxState === 'checked'}
                            // Use a ref to set the indeterminate property directly on the DOM node
                            ref={el => el && (el.indeterminate = checkboxState === 'indeterminate')}
                            onChange={handleMasterCheckboxChange}
                            aria-label="Select all emails"
                        />
                        <span className="checkmark">
                            {/* Use CSS :indeterminate pseudo-class or a simple span for the dash */}
                            {checkboxState === 'indeterminate' && <span className="indeterminate-mark"></span>}
                        </span>
                    </label>
                    <button
                        type="button" // Explicitly set type
                        className="icon-button select-dropdown-toggle"
                        onClick={() => setShowSelectDropdown(!showSelectDropdown)}
                        aria-label="More selection options"
                        aria-haspopup="true"
                        aria-expanded={showSelectDropdown}
                        title="More selection options"
                    >
                        <FiChevronDown />
                    </button>
                    <AnimatePresence>
                        {showSelectDropdown && (
                            <motion.div
                                className="dropdown-menu select-options-menu"
                                initial={{ opacity: 0, scale: 0.95, y: -5 }} // Slightly different animation
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                transition={{ duration: 0.1 }} // Faster animation
                            >
                                {selectOptions.map(option => (
                                    <button
                                        type="button"
                                        key={option.id}
                                        className="dropdown-item"
                                        onClick={() => handleSelectOptionClick(option.id)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- Refresh Button --- */}
                <button
                    type="button"
                    className="icon-button refresh-button"
                    onClick={onRefresh}
                    aria-label="Refresh email list"
                    title="Refresh"
                >
                    <FiRefreshCw />
                </button>

                {/* Add other action buttons here if needed, shown conditionally */}
                {/* Example: Delete button shown when items are selected */}
                {/* {selectedEmailsCount > 0 && (
                     <button type="button" className="icon-button action-button" title="Delete Selected">
                         <FiTrash />
                     </button>
                 )} */}

            </div>

            <div className="header-right">
                {/* --- Sort Dropdown --- */}
                <div className="sort-control" ref={sortDropdownRef}>
                    <button
                        type="button"
                        className="sort-button"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        aria-haspopup="true"
                        aria-expanded={showSortDropdown}
                    >
                        {/* Sort icon visible on smaller screens */}
                        <FiFilter className="sort-icon-indicator" aria-hidden="true" />
                        <span className="sort-label">{getSelectedSortLabel()}</span>
                        <FiChevronDown className="dropdown-arrow" aria-hidden="true" />
                    </button>
                    <AnimatePresence>
                        {showSortDropdown && (
                            <motion.div
                                className="dropdown-menu sort-options-menu"
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                transition={{ duration: 0.1 }}
                            >
                                {sortOptions.map(option => (
                                    <button
                                        type="button"
                                        key={option.id}
                                        className={`dropdown-item ${currentSort === option.id ? 'active' : ''}`}
                                        onClick={() => handleSortOptionClick(option.id)}
                                        aria-pressed={currentSort === option.id}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- View Options --- */}
                <div className="view-options">
                    <button
                        type="button"
                        className={`icon-button view-option ${currentView === 'compact' ? 'active' : ''}`}
                        onClick={() => handleViewOptionClick('compact')}
                        aria-label="Compact view"
                        title="Compact view"
                        aria-pressed={currentView === 'compact'}
                    >
                        <FiList />
                    </button>
                    <button
                        type="button"
                        className={`icon-button view-option ${currentView === 'default' ? 'active' : ''}`}
                        onClick={() => handleViewOptionClick('default')}
                        aria-label="Default view"
                        title="Default view"
                        aria-pressed={currentView === 'default'}
                    >
                        <FiAlignLeft />
                    </button>
                </div>
            </div>
        </div>
    );
};

// PropTypes remain useful for clarity
EmailListHeader.propTypes = {
    selectedEmailsCount: PropTypes.number,
    totalEmailsCount: PropTypes.number,
    isAllSelected: PropTypes.bool,
    currentSort: PropTypes.string,
    currentView: PropTypes.string,
    sortOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    selectOptions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    onSelectChange: PropTypes.func,
    onRefresh: PropTypes.func,
    onSortChange: PropTypes.func,
    onViewChange: PropTypes.func,
};

export default EmailListHeader;