import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import "../../Styles/Navbar.css"
import NavLogo from "./Navbarlogo"
import { buttonVariants, navbarVariants } from './Animationconstants';
import MobileMenuToggle from './MobileMenuToggle';
import NavLinks from './Navlinks';
import NavActions from './Navactions';
import { loginWithGoogle, logout } from '../../Api/Authentication';
import { fetchUserProfile } from '../../Api/UserFunctions';
import { clearUser, fetchUser, selectIsAuthenticated, selectUser } from '../../Redux/Slice/authslice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await dispatch(fetchUserProfile());
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            }
        };

        // Check auth status when component mounts
        checkAuth();
    }, []); // Run only on mount

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
            // Google OAuth will redirect, no need for additional state updates here
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(clearUser());
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.nav-item')) {
                closeAllDropdowns();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const closeAllDropdowns = () => {
        setActiveDropdown(null);
    };

    return (
        <div className="navbar-wrapper">
            <motion.header
                className={`navbar ${isScrolled ? 'scrolled' : ''}`}
                variants={navbarVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="navbar-container">
                    <NavLogo />

                    <div className="navbar-center">
                        <NavLinks
                            mobileMenuOpen={mobileMenuOpen}
                            activeDropdown={activeDropdown}
                            toggleDropdown={toggleDropdown}
                            handleLogin={handleLogin}
                        />
                    </div>

                    <NavActions
                        isLoggedIn={isAuthenticated}
                        userInfo={user}
                        activeDropdown={activeDropdown}
                        toggleDropdown={toggleDropdown}
                        handleLogin={handleLogin}
                        handleLogout={handleLogout}
                    />

                    <MobileMenuToggle
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                    />
                </motion.div>
            </motion.header>
        </div>
    );
};

export default Navbar;