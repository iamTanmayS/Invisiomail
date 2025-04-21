import React, { useState, useRef, useEffect } from 'react';
import "../../Styles/Dashboard/Usermenu.css"

function UserMenu({ avatarSrc, userName, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close menu if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Focus management (optional, but good practice)
    useEffect(() => {
        if (isOpen && menuRef.current) {
            // Find first focusable item or the menu itself
            const firstFocusable = menuRef.current.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                menuRef.current.focus(); // Focus the container if no items
            }
        }
    }, [isOpen]);

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus(); // Return focus to button
        }
    };


    return (
        <div className="user-menu-container">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="user-menu-button"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <img
                    className="user-menu-avatar"
                    src={avatarSrc}
                    alt={userName}
                />
                <span className="sr-only">User menu</span>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="user-menu-dropdown"
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="user menu"
                    tabIndex="-1" // Make it focusable for Escape key
                    onKeyDown={handleKeyDown}
                >
                    {/* Render children passed to it (the menu items) */}
                    {children}
                </div>
            )}
        </div>
    );
}

// Default props for menu items if needed, or style them directly
UserMenu.Item = ({ href = "#", children }) => (
    <a href={href} className="user-menu-item" role="menuitem">
        {children}
    </a>
);


export default UserMenu;