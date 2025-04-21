// NavbarComponents/NavLinks.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { dropdownVariants, itemVariants, buttonVariants } from './Animationconstants';
import DropdownContent from './Dropdown';

const NavLinks = ({ mobileMenuOpen, activeDropdown, toggleDropdown, handleLogin }) => {
    return (
        <motion.div
            className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            {['platform', 'solutions', 'resources', 'company'].map((item, index) => (
                <motion.div
                    key={item}
                    className="nav-item"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    transition={{ delay: 0.1 * index }}
                >
                    <motion.button
                        className={`dropdown-toggle ${activeDropdown === item ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item)}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}

                        <motion.div
                            animate={{ rotate: activeDropdown === item ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronDown size={16} />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {activeDropdown === item && (
                            <motion.div
                                className="dropdown-menu"
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <DropdownContent type={item} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}

            <motion.a
                href="/pricing"
                className="nav-link"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
            >
                Pricing
            </motion.a>

            {/* Mobile-only buttons */}
            {mobileMenuOpen && (
                <>
                    <motion.button
                        className="login-button"
                        onClick={handleLogin}
                        variants={buttonVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Login
                    </motion.button>
                    <motion.a
                        href="/try-free"
                        className="try-free-button"
                        variants={buttonVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 4px 20px rgba(118, 171, 174, 0.3)"
                        }}
                        whileTap="tap"
                    >
                        Try Free
                    </motion.a>
                </>
            )}
        </motion.div>
    );
};

export default NavLinks;