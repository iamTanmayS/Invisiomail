// NavbarComponents/NavLinks.jsx

import { AnimatePresence, motion } from 'framer-motion';
import { buttonVariants, dropdownVariants, itemVariants } from './Animationconstants';

import { ChevronDown } from 'lucide-react';
import DropdownContent from './Dropdown';
import React from 'react';

const NavLinks = ({ mobileMenuOpen, activeDropdown, toggleDropdown, handleLogin }) => {
    return (
        <motion.div
            className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
            {[].map((item, index) => (  // add elements inside the array to create the dropdown for them
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
                href="/analytics"
                className="nav-link"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
            >
                Dashboard
            </motion.a>

            <motion.a
                href="https://sprinkle-catamaran-a18.notion.site/InvisioMail-Documentation-1e9ef125dd9380f9890dc750582ff775"
                className="nav-link"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
            >
                Documentation
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