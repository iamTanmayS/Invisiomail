import "../../Styles/Dashboard/DashboardStyles/EmailDashboard.scss";

import React, { useEffect, useState } from 'react';

import ComposeButton from '../Dashboard/ComposeButton';
import EmailList from '../Dashboard/EmailList';
import Pagination from '../Dashboard/Pagination';
import SearchBar from "../Dashboard/Searchbar";
import SkeletonLoader from '../Dashboard/SkeletonLoader';
import { fetchallemails } from '../../Api/EmailsFunctions';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EmailDashboard = () => {
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [prevPageTokens, setPrevPageTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const Navigation = useNavigate();
    // Fetch emails from API
    const fetchEmails = async (pageToken = null) => {
        setIsLoading(true);
        try {
            const data = await fetchallemails(pageToken);
            setEmails(data.messages || []);
            setNextPageToken(data.nextPageToken || null);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching emails:', error);
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchEmails();
    }, []);

    // Handle pagination
    const handleNextPage = () => {
        if (nextPageToken) {
            const currentToken = prevPageTokens.length > 0 ? prevPageTokens[prevPageTokens.length - 1] : null;
            setPrevPageTokens([...prevPageTokens, currentToken]);
            setCurrentPage(currentPage + 1);
            fetchEmails(nextPageToken);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPrevTokens = [...prevPageTokens];
            const prevToken = newPrevTokens.pop();
            setPrevPageTokens(newPrevTokens);
            setCurrentPage(currentPage - 1);
            fetchEmails(prevToken);
        }
    };

    const handleCompose = () => {
        Navigation.navigate("/email/send")
    }

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
        setPrevPageTokens([]);
    };

    // Handle email selection
    const toggleEmailSelection = (emailId) => {
        if (selectedEmails.includes(emailId)) {
            setSelectedEmails(selectedEmails.filter(id => id !== emailId));
        } else {
            setSelectedEmails([...selectedEmails, emailId]);
        }
    };

    // Filter emails based on search query (Client-side filtering)
    const filteredEmails = searchQuery
        ? emails.filter(email =>
        (email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.body?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.from?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : emails;

    return (
        <motion.div
            className="email-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <SearchBar onSearch={handleSearch} />

            <motion.div
                className="dashboard-content"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="dashboard-header">
                    <h1>Inbox</h1>
                    {selectedEmails.length > 0 && (
                        <div className="selected-actions">
                            <button className="action-button" title="Archive">
                                <i className="fas fa-archive"></i>
                            </button>
                            <button className="action-button" title="Delete">
                                <i className="fas fa-trash"></i>
                            </button>
                            <button className="action-button" title="Mark as read/unread or Label">
                                <i className="fas fa-tag"></i>
                            </button>
                        </div>
                    )}
                </div>

                <div className="email-list-container">
                    {isLoading ? (
                        <SkeletonLoader count={10} />
                    ) : (
                        <EmailList
                            emails={filteredEmails}
                            selectedEmails={selectedEmails}
                            onToggleSelection={toggleEmailSelection}
                        />
                    )}
                </div>

                {!isLoading && (filteredEmails.length > 0 || nextPageToken) && !searchQuery && (
                    <div className="pagination-container">
                        <Pagination
                            currentPage={currentPage}
                            hasNext={!!nextPageToken}
                            hasPrev={currentPage > 1}
                            onNextPage={handleNextPage}
                            onPrevPage={handlePrevPage}
                        />
                    </div>
                )}

                {!isLoading && searchQuery && filteredEmails.length > 0 && (
                    <div className="search-results-info">
                        Displaying {filteredEmails.length} results for "{searchQuery}"
                    </div>
                )}
            </motion.div>

            <ComposeButton />
        </motion.div>
    );
};

export default EmailDashboard;