// NavbarComponents/MobileMenuToggle.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from './Animationconstants';


const MobileMenuToggle = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    return (
        <motion.button
            className="mobile-menu-toggle"
            variants={buttonVariants}
            initial="initial"
            whileTap="tap"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
            <motion.div
                className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
                animate={mobileMenuOpen ? "open" : "closed"}
            >
                <motion.span
                    animate={mobileMenuOpen ?
                        { rotate: 45, y: 6, backgroundColor: "#76ABAE" } :
                        { rotate: 0, y: 0, backgroundColor: "#EEEEEE" }
                    }
                    transition={{ duration: 0.3 }}
                />
                <motion.span
                    animate={mobileMenuOpen ?
                        { opacity: 0 } :
                        { opacity: 1 }
                    }
                    transition={{ duration: 0.3 }}
                />
                <motion.span
                    animate={mobileMenuOpen ?
                        { rotate: -45, y: -6, backgroundColor: "#76ABAE" } :
                        { rotate: 0, y: 0, backgroundColor: "#EEEEEE" }
                    }
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.button>
    );
};

export default MobileMenuToggle;