import "../Styles/Pages/EmailAnalytics.css"; // Import the CSS file

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCallback, useEffect, useState } from "react"; // Import useCallback

import fetchUserEmails from "../Api/Dashboard"; // Import your API function

export default function EmailAnalytics() {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false); // Separate state for refresh loading
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState("list"); // list, detail

    // --- Data Loading Function ---
    // useCallback ensures this function reference is stable unless dependencies change
    const loadEmails = useCallback(async () => {
        // Indicate loading state (either initial or refresh)
        if (!loading) setIsRefreshing(true); // Only set refresh state if not initial load

        try {
            const response = await fetchUserEmails();
            // Ensure response is an array before setting state
            if (Array.isArray(response)) {
                setEmails(response);
            } else {
                console.error("API did not return an array:", response);
                setEmails([]); // Set to empty array on error or invalid format
            }
        } catch (error) {
            console.error("Failed to fetch emails:", error);
            setEmails([]); // Set to empty array on fetch error
        } finally {
            setLoading(false); // Turn off initial loading indicator
            setIsRefreshing(false); // Turn off refresh loading indicator
        }
    }, [loading]); // Recreate if 'loading' state changes (useful if logic depended on it)

    // --- Initial Data Load ---
    useEffect(() => {
        loadEmails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    // --- Format date to readable format ---
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "Invalid Date";
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return "Invalid Date";
        }
    };

    // --- Filter emails based on search query ---
    const filteredEmails = emails
        .sort((a, b) => {
            // Convert dates to timestamps for comparison
            const dateA = new Date(a?.sentAt || 0).getTime();
            const dateB = new Date(b?.sentAt || 0).getTime();
            // Sort in descending order (latest first)
            return dateB - dateA;
        })
        .filter(email =>
            (email?.subject?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
            (email?.receiver?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
        );

    // --- Chart data preparation ---
    // Ensure emails is an array and has data before mapping
    const chartData = Array.isArray(emails) ?
        [...emails] // Create a copy to avoid modifying original array
            .sort((a, b) => {
                const dateA = new Date(a?.sentAt || 0).getTime();
                const dateB = new Date(b?.sentAt || 0).getTime();
                return dateB - dateA;
            })
            .slice(0, 10) // Get only the latest 10 emails for the chart
            .map(email => ({
                id: email?._id ?? 'N/A',
                subject: email?.subject?.length > 15 ? email.subject.substring(0, 15) + '...' : (email?.subject ?? 'No Subject'),
                openCount: email?.openCount ?? 0
            })) : [];
  
    const handleRefresh = () => {
     
        if (isRefreshing) return;
        console.log("Refreshing emails...");
        loadEmails(); // Call the memoized load function
    };

    // --- Handle Export ---
    const handleExport = () => {
        console.log("Exporting data...");
        if (!filteredEmails.length) {
            alert("No data available to export.");
            return;
        }

        // Define CSV Headers
        const headers = [
            "Subject",
            "Recipient",
            "Sender",
            "SentDate",
            "Status",
            "ReadStatus",
            "OpenCount",
            "MessageID",
            "InternalID",
            // "Body" // Avoid exporting full HTML body by default, can be large/complex
        ];

        // Convert email data to CSV rows
        const rows = filteredEmails.map(email => [
            `"${(email?.subject ?? '').replace(/"/g, '""')}"`, // Escape double quotes
            `"${(email?.receiver ?? '').replace(/"/g, '""')}"`,
            `"${(email?.sender ?? '').replace(/"/g, '""')}"`,
            `"${formatDate(email?.sentAt ?? '')}"`,
            `"${(email?.status ?? '').replace(/"/g, '""')}"`,
            `"${(email?.readStatus ?? '').replace(/"/g, '""')}"`,
            email?.openCount ?? 0,
            `"${(email?.messageId ?? '').replace(/"/g, '""')}"`,
            `"${(email?._id ?? '').replace(/"/g, '""')}"`,
            // `"${(email?.body ?? '').replace(/"/g, '""')}"` // Add if body export is needed
        ].join(',')); // Join fields with comma

        // Combine headers and rows
        const csvContent = [headers.join(','), ...rows].join('\n');

        // Create Blob and Trigger Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) { // Check for browser support
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "email-analytics-export.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Clean up
        } else {
            alert("CSV export is not supported in your browser.");
        }
    };


    // --- Handle email selection for detail view ---
    const viewEmailDetails = (email) => {
        setSelectedEmail(email);
        setView("detail");
    };

    // --- Back to list view ---
    const backToList = () => {
        setView("list");
        setSelectedEmail(null);
    };

    // --- Render Loading State ---
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading your email analytics...</p>
                </div>
            </div>
        );
    }

    // --- Get Accent Color from CSS Variable (for chart) ---
    // Note: This runs client-side after initial render. Default needed.
    const accentColor = typeof window !== 'undefined'
        ? getComputedStyle(document.documentElement).getPropertyValue('--accent-blue').trim() || '#4299e1'
        : '#4299e1'; // Default color


    // --- Main Render ---
    return (
        <div className="analytics-container">
            {view === "list" ? (
                // --- List View ---
                <div className="main-content">
                    <header className="page-header">
                        <h1 className="page-title">Email Analytics Dashboard</h1>
                        <p className="page-subtitle">Track and analyze your email campaign performance</p>
                    </header>

                    <div className="analytics-card overview-card">
                        <div className="card-header-controls">
                            <div className="search-control">
                                <i className="search-icon">🔍</i>
                                <input
                                    type="text"
                                    placeholder="Search emails by subject or recipient..."
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isRefreshing} // Disable search while refreshing
                                />
                            </div>

                            <div className="action-buttons">
                                <button
                                    className={`btn-primary ${isRefreshing ? 'btn-disabled' : ''}`} // Add disabled style if needed
                                    onClick={handleRefresh}
                                    disabled={isRefreshing} // Disable button while refreshing
                                >
                                    <i className={`icon-refresh ${isRefreshing ? 'spinning' : ''}`}>↻</i> {/* Add spinning class */}
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={handleExport}
                                    disabled={isRefreshing || !filteredEmails.length} // Disable if refreshing or no data
                                >
                                    <i className="icon-download">↓</i>
                                    Export
                                </button>
                            </div>
                        </div>

                        <div className="chart-section">
                            <h2 className="section-title">Email Open Rate Overview</h2>
                            {/* Conditionally render chart only if data exists */}
                            {chartData.length > 0 ? (
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
                                            <CartesianGrid strokeDasharray="3 3" /* Style via CSS */ />
                                            <XAxis
                                                dataKey="subject"
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                                tick={{ fontSize: 12 /* Style via CSS */ }}
                                                interval={0} // Show all ticks if space allows
                                            />
                                            <YAxis name="Opens" /* Style via CSS */ />
                                            <Tooltip /* Style via CSS */ />
                                            <Bar
                                                dataKey="openCount"
                                                fill={accentColor} // Use dynamic accent color
                                                name="Opens"
                                                isAnimationActive={!isRefreshing} // Disable animation during refresh potentially
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p className="no-results" style={{ textAlign: 'center', padding: '2rem' }}>No chart data available.</p>
                            )}
                        </div>
                    </div>

                    <div className="analytics-card">
                        <div className="card-header">
                            <h2 className="section-title">Email Campaign List</h2>
                            <p className="section-subtitle">Click on an email to view detailed analytics</p>
                        </div>

                        <div className="table-responsive">
                            <table className="analytics-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Recipient</th>
                                        <th>Sent Date</th>
                                        <th>Status</th>
                                        <th>Opens</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmails.length > 0 ? (
                                        filteredEmails.map((email) => (
                                            <tr key={email?._id ?? Math.random()} onClick={() => viewEmailDetails(email)}>
                                                <td className="email-subject">{email?.subject ?? 'N/A'}</td>
                                                <td>{email?.receiver ?? 'N/A'}</td>
                                                <td>{formatDate(email?.sentAt)}</td>
                                                <td>
                                                    <span className={`status-pill status-${email?.status ?? 'unknown'}`}>
                                                        {/* Capitalize first letter, handle undefined */}
                                                        {(email?.status ?? 'unknown').charAt(0).toUpperCase() + (email?.status ?? 'unknown').slice(1)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="open-count">
                                                        <i className="icon-eye">👁️</i>
                                                        <span>{email?.openCount ?? 0}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {/* Prevent row click propagation when clicking button */}
                                                    <button className="btn-view" onClick={(e) => { e.stopPropagation(); viewEmailDetails(email); }}>View Details</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-results">
                                                {isRefreshing ? 'Refreshing data...' : (searchQuery ? 'No emails found matching your search.' : 'No emails found.')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // --- Detail View ---
                <div className="main-content">
                    <button
                        onClick={backToList}
                        className="back-button"
                    >
                        <i className="icon-arrow-left">←</i>
                        Back to Email List
                    </button>

                    {selectedEmail && (
                        <div className="email-detail-container">
                            {/* Header */}
                            <header className="email-detail-header">
                                <h1 className="email-detail-title">{selectedEmail.subject ?? 'N/A'}</h1>
                                <div className="email-metadata">
                                    {/* Metadata Items */}
                                    <div className="metadata-item"><i className="icon-mail">✉️</i><span>From: {selectedEmail.sender ?? 'N/A'}</span></div>
                                    <div className="metadata-item"><i className="icon-mail">✉️</i><span>To: {selectedEmail.receiver ?? 'N/A'}</span></div>
                                    <div className="metadata-item"><i className="icon-calendar">📅</i><span>Sent: {formatDate(selectedEmail.sentAt)}</span></div>
                                    <div className="metadata-item"><i className="icon-eye">👁️</i><span>Opens: {selectedEmail.openCount ?? 0}</span></div>
                                </div>
                            </header>

                            {/* Content Section */}
                            <div className="email-content-section">
                                <h2 className="section-title">Email Content</h2>
                                <div className="email-content">
                                    {/* Render HTML safely, consider sanitization library if content is user-generated */}
                                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.body ?? '<p>No content available.</p>' }} />
                                </div>
                            </div>

                            {/* Tracking Section */}
                            <div className="tracking-section">
                                <h2 className="section-title">Tracking Information</h2>
                                <div className="stats-grid">
                                    {/* Stats Cards */}
                                    <div className="stats-card blue-card"><p className="stats-label">Status</p><p className="stats-value">{(selectedEmail.status ?? 'N/A').charAt(0).toUpperCase() + (selectedEmail.status ?? '').slice(1)}</p></div>
                                    <div className="stats-card green-card"><p className="stats-label">Read Status</p><p className="stats-value">{(selectedEmail.readStatus ?? 'N/A').charAt(0).toUpperCase() + (selectedEmail.readStatus ?? '').slice(1)}</p></div>
                                    <div className="stats-card purple-card"><p className="stats-label">Open Count</p><p className="stats-value">{selectedEmail.openCount ?? 0}</p></div>
                                    <div className="stats-card amber-card"><p className="stats-label">Tracking</p><p className="stats-value">{selectedEmail.updation ?? 'N/A'}</p></div>
                                </div>
                            </div>

                            {/* Technical Section */}
                            <div className="technical-section">
                                <h2 className="section-title">Technical Details</h2>
                                <table className="details-table">
                                    <tbody>
                                        {/* Detail Rows */}
                                        <tr><td className="detail-label">Message ID</td><td className="detail-value">{selectedEmail.messageId ?? 'N/A'}</td></tr>
                                        <tr><td className="detail-label">Internal ID</td><td className="detail-value">{selectedEmail._id ?? 'N/A'}</td></tr>
                                        <tr><td className="detail-label">User ID</td><td className="detail-value">{selectedEmail.user ?? 'N/A'}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}