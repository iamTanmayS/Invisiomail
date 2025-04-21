// NavbarComponents/NavLogo.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NavLogo = () => {
    return (
        <motion.div
            className="navbar-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <motion.a
                href="/"
                className="logo-link"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
            >
                <img src="../public/invisioMail.svg" alt="Logo" className="logo" />
            </motion.a>
        </motion.div>
    );
};

export default NavLogo;