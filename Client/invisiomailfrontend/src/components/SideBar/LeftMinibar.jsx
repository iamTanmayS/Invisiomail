import React from 'react';
import "../../Styles/Dashboard/Leftminibar.css"
import UserMenu from './UserMenu';
import { LuMessageSquareText } from "react-icons/lu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdMenuOpen } from "react-icons/md";

function LeftMiniBar({
    isSidebarOpen,
    currentSidebarTab,
    onToggleSidebar,
    avatarSrc,
    userName
}) {

    const isTabActive = (tabName) => isSidebarOpen && currentSidebarTab === tabName;

    return (
        <nav aria-label="Options" className="left-mini-bar">
            {/* Logo */}
            <div className="mini-bar-logo-container">
                <a href="#">
                    <img
                        className="mini-bar-logo"
                        src="/assets/logo.png" // Adjust path
                        alt="K-UI"
                    />
                </a>
            </div>

            <div className="mini-bar-buttons">
                {/* Menu button */}
                <button
                    onClick={() => onToggleSidebar('linksTab')}
                    className={`mini-bar-button ${isTabActive('linksTab') ? 'active' : ''}`}
                    title="Toggle Navigation"
                >
                    <span className="sr-only">Toggle sidebar</span>
                    <MdMenuOpen />
                </button>
                {/* Messages button */}
                <button
                    onClick={() => onToggleSidebar('messagesTab')}
                    className={`mini-bar-button ${isTabActive('messagesTab') ? 'active' : ''}`}
                    title="Toggle Messages"
                >
                    <span className="sr-only">Toggle message panel</span>
                    <LuMessageSquareText />
                </button>
                {/* Notifications button */}
                <button
                    onClick={() => onToggleSidebar('notificationsTab')}
                    className={`mini-bar-button ${isTabActive('notificationsTab') ? 'active' : ''}`}
                    title="Toggle Notifications"
                >
                    <span className="sr-only">Toggle notifications panel</span>
                    <IoIosNotificationsOutline />
                </button>
            </div>

            {/* User avatar */}
            <div className="mini-bar-user-menu">
                <UserMenu
                    avatarSrc={avatarSrc}
                    userName={userName}
                >
                    {/* Use UserMenu.Item or style directly */}
                    <a href="#" className="user-menu-item" role="menuitem">Your Profile</a>
                    <a href="#" className="user-menu-item" role="menuitem">Settings</a>
                    <a href="#" className="user-menu-item" role="menuitem">Sign out</a>
                </UserMenu>
            </div>
        </nav>
    );
}

// Placeholder Icons (Define these properly)


export default LeftMiniBar;