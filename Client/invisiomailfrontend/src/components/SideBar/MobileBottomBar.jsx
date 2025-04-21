import React from 'react';
import "../../Styles/Dashboard/Mobilebottombar.css"
import UserMenu from './UserMenu'; // Import the reusable UserMenu
import { MdMenuOpen } from "react-icons/md";
function MobileBottomBar({
    isSidebarOpen,
    currentSidebarTab,
    onToggleSidebar,
    avatarSrc,
    userName
}) {

    const isLinksTabActive = isSidebarOpen && currentSidebarTab === 'linksTab';

    return (
        <nav
            aria-label="Options"
            className="mobile-bottom-bar"
        >
            {/* Menu button */}
            <button
                onClick={() => onToggleSidebar('linksTab')}
                className={`nav-button ${isLinksTabActive ? 'active' : ''}`}
            >
                <span className="sr-only">Toggle sidebar</span>
                <MdMenuOpen />
            </button>

            {/* Logo */}
            <a href="#">
                <img
                    className="nav-logo"
                    src="/assets/logo.png" // Adjust path as needed
                    alt="K-UI"
                />
            </a>

            {/* User avatar button */}
            <div className="nav-user-menu">
                <UserMenu
                    avatarSrc={avatarSrc}
                    userName={userName}
                >
                    <UserMenu.Item href="#">Your Profile</UserMenu.Item>
                    <UserMenu.Item href="#">Settings</UserMenu.Item>
                    <UserMenu.Item href="#">Sign out</UserMenu.Item>
                </UserMenu>
            </div>
        </nav>
    );
}

export default MobileBottomBar;