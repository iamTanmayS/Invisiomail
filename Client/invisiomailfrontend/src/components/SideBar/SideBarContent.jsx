import React from 'react';
import "../../Styles/Dashboard/Sidebarcontent.css"
import { TiHomeOutline } from "react-icons/ti";
import { RiPageSeparator } from "react-icons/ri";
import logo from "../../../public/InvisioMail.svg"
function SidebarContent({ isOpen, currentTab }) {
    // Classes are managed by the parent based on isOpen state
    return (
        <div className={`sidebar-content ${isOpen ? 'open' : ''}`}>
            {/* Links Tab Content */}
            {currentTab === 'linksTab' && (
                <nav aria-label="Main" className="sidebar-nav">
                    {/* Logo */}
                    <div className="sidebar-logo-container">
                        <a href="#">
                            <img
                                className="sidebar-logo"
                                src={logo}
                                alt="K-UI"
                            />
                        </a>
                    </div>

                    {/* Links */}
                    <div className="sidebar-links">
                        <a href="#" className="sidebar-link active">
                            <span className="link-icon-bg">
                                <TiHomeOutline />
                            </span>
                            <span>Home</span>
                        </a>
                        <a href="#" className="sidebar-link">
                            <span className="link-icon-bg">
                                <RiPageSeparator />
                            </span>
                            <span>Pages</span>
                        </a>
                        {/* Add more links as needed */}
                    </div>

                    {/* Upgrade Promo */}
                    <div className="sidebar-promo">
                        <div className="promo-card">
                            <img
                                aria-hidden="true"
                                className="promo-image"
                                src="https://plus.unsplash.com/premium_photo-1744967143306-0ec5b49ca2eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Adjust path
                                alt=""
                            />
                            <p className="promo-text">
                                Use our <span className="promo-highlight">Premium</span> features now! <br />
                            </p>
                            <button className="promo-button">
                                Upgrade to pro
                            </button>
                        </div>
                        {/* Mobile Only Button */}
                        <button className="promo-button-mobile">
                            Upgrade to pro
                        </button>
                    </div>
                </nav>
            )}

            {/* Messages Tab Content */}
            {currentTab === 'messagesTab' && (
                <section className="sidebar-section">
                    <h2 className="section-title">Messages</h2>
                    {/* Message content goes here */}
                </section>
            )}

            {/* Notifications Tab Content */}
            {currentTab === 'notificationsTab' && (
                <section className="sidebar-section">
                    <h2 className="section-title">Notifications</h2>
                    {/* Notification content goes here */}
                </section>
            )}
        </div>
    );
}


export default SidebarContent;