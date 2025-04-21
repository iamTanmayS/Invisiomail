// NavbarComponents/NavActions.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, dropdownVariants } from "./Animationconstants"
import ProfileDropdown from './ProfileDropdown';


const NavActions = ({
    isLoggedIn,
    userInfo,
    activeDropdown,
    toggleDropdown,
    handleLogin,
    handleLogout
}) => {
    return (
        <motion.div
            className="navbar-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            {isLoggedIn ? (
                <motion.div
                    className="nav-item user-profile"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                >
                    <motion.button
                        className={`profile-button ${activeDropdown === 'profile' ? 'active' : ''}`}
                        onClick={() => toggleDropdown('profile')}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.img
                            src={userInfo.picture}
                            alt="User Profile"
                            className="profile-image"
                            whileHover={{ borderColor: "#EEEEEE" }}
                        />
                    </motion.button>
                    <AnimatePresence>
                        {activeDropdown === 'profile' && (
                            <motion.div
                                className="dropdown-menu profile-dropdown"
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <ProfileDropdown userInfo={userInfo} handleLogout={handleLogout} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <>
                    <motion.button
                        className="login-button"
                        onClick={handleLogin}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Login
                    </motion.button>
                    {/* <motion.a
                        href="/try-free"
                        className="try-free-button shimmer-effect"
                        variants={buttonVariants}
                        initial="initial"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 20px rgba(118, 171, 174, 0.5)"
                        }}
                        whileTap="tap"
                    >
                        Try Free
                    </motion.a> */}
                </>
            )}
        </motion.div>
    );
};

export default NavActions;