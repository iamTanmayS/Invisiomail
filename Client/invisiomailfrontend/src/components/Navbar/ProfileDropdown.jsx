// NavbarComponents/ProfileDropdown.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { itemVariants } from './Animationconstants'

const ProfileDropdown = ({ userInfo, handleLogout }) => {
    return (
        <div className="profile-content">
            <motion.div
                className="profile-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <motion.img
                    src={userInfo.picture}
                    alt="User Profile"
                    className="profile-image-large"
                    whileHover={{ scale: 1.05, borderColor: "#EEEEEE" }}
                />
                <div className="profile-info">
                    <h3>{userInfo.userName}</h3>
                    <p>{userInfo.email}</p>
                </div>
            </motion.div>
            <div className="profile-menu">
                <motion.a
                    href="/profile"
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                    <User size={16} />
                    <span>Your Profile</span>
                </motion.a>
                <motion.a
                    href="/settings"
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                    <Settings size={16} />
                    <span>Settings</span>
                </motion.a>

                <motion.a
                    href="/help"
                    variants={itemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                    <HelpCircle size={16} />
                    <span>Help & Support</span>
                </motion.a>
                <motion.button
                    className="logout-button"
                    onClick={handleLogout}
                    variants={itemVariants}
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 77, 77, 0.1)", transition: { duration: 0.2 } }}
                >
                    <LogOut size={16} />
                    <span>Log Out</span>
                </motion.button>
            </div>
        </div>
    );
};

export default ProfileDropdown;