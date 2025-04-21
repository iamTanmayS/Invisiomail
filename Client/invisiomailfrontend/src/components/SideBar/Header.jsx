import React, { useState } from 'react';
import "../../Styles/Dashboard/Header.css"
import { CiSettings } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import { IoIosNotificationsOutline, IoMdMore } from "react-icons/io";


function Header({ onToggleSettings, onToggleSidebar }) {
    const [isSubHeaderOpen, setIsSubHeaderOpen] = useState(false);

    const toggleSubHeader = () => setIsSubHeaderOpen(!isSubHeaderOpen);

    const handleSubHeaderAction = (action) => {
        action(); // Execute the passed action (toggle settings/sidebar)
        setIsSubHeaderOpen(false); // Close subheader after action
    };

    return (
        <header className="dashboard-header">
            {/* Search Form Placeholder */}
            <form action="#" className="header-search-form">
                {/* Input field would go here */}
            </form>

            {/* Desktop Header Buttons */}
            <div className="header-desktop-buttons">
                <button
                    onClick={onToggleSettings}
                    className="header-button"
                    title="Settings"
                >
                    <span className="sr-only">Settings</span>
                    <CiSettings />
                </button>

                <a
                    href="https://github.com/kamona-ui/dashboard-alpine"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-button github-button"
                    title="View on GitHub"
                >
                    <span className="sr-only">GitHub link</span>
                    <FaGithub />
                </a>
            </div>

            {/* Mobile Sub Header Toggle Button */}
            <button
                onClick={toggleSubHeader}
                className="header-mobile-toggle"
                aria-haspopup="true"
                aria-expanded={isSubHeaderOpen}
            >
                <span className="sr-only">More options</span>
                <IoMdMore />
            </button>

            {/* Mobile Sub Header (Dropdown) */}
            {isSubHeaderOpen && (
                <div className="mobile-sub-header">
                    {/* Settings */}
                    <button
                        onClick={() => handleSubHeaderAction(onToggleSettings)}
                        className="header-button"
                        title="Settings"
                    >
                        <span className="sr-only">Settings</span>
                        <CiSettings />
                    </button>
                    {/* Messages */}
                    <button
                        onClick={() => handleSubHeaderAction(() => onToggleSidebar('messagesTab'))}
                        className="header-button"
                        title="Messages"
                    >
                        <span className="sr-only">Toggle message panel</span>
                        <LuMessageSquareText/>
                    </button>
                    {/* Notifications */}
                    <button
                        onClick={() => handleSubHeaderAction(() => onToggleSidebar('notificationsTab'))}
                        className="header-button"
                        title="Notifications"
                    >
                        <span className="sr-only">Toggle notifications panel</span>
                        <IoIosNotificationsOutline />
                    </button>
                    {/* GitHub Link */}
                    <a
                        href="https://github.com/kamona-ui/dashboard-alpine"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="header-button github-button"
                        title="View on GitHub"
                    >
                        <span className="sr-only">GitHub link</span>
                        <FaGithub/>
                    </a>
                </div>
            )}
        </header>
    );
}


export default Header;