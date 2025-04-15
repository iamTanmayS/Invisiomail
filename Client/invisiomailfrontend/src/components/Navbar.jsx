import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Settings, User, LogOut, HelpCircle, Bell, 
  Bookmark, Book, Code, Database, Globe, Users, 
  Briefcase, FileText, Phone, Mail, MapPin, Heart,
  Shield, Server, Monitor, Cloud, Zap, Terminal
} from 'lucide-react';
import "../Styles/Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.nav-item')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Enhanced animation variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 1,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      y: -2,
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const hamburgerVariants = {
    closed: {},
    open: {}
  };

  const renderDropdownContent = (type) => {
    const dropdownData = {
      platform: {
        sections: [
          {
            heading: "CAPABILITIES",
            items: [
              { icon: <Database size={16} />, label: "Real-Time Analytics", href: "/platform/real-time-analytics" },
              { icon: <Globe size={16} />, label: "Vector Search", href: "/platform/vector-search" },
              { icon: <Code size={16} />, label: "Data API", href: "/platform/data-api" },
              { icon: <Server size={16} />, label: "Operational Data Processing", href: "/platform/operational-data-processing" }
            ]
          },
          {
            heading: "PRODUCT",
            items: [
              { icon: <Cloud size={16} />, label: "Cloud", href: "/product/cloud" },
              { icon: <Monitor size={16} />, label: "On-Premises", href: "/product/on-premises" },
              { icon: <Terminal size={16} />, label: "Connectors", href: "/product/connectors" },
              { icon: <Zap size={16} />, label: "Integrations", href: "/product/integrations" }
            ]
          }
        ],
        image: { src: "/api/placeholder/200/150", alt: "Platform", caption: "Unified database for modern applications" }
      },
      solutions: {
        sections: [
          {
            heading: "BY INDUSTRY",
            items: [
              { icon: <Briefcase size={16} />, label: "Financial Services", href: "/solutions/financial-services" },
              { icon: <Heart size={16} />, label: "Healthcare", href: "/solutions/healthcare" },
              { icon: <Users size={16} />, label: "E-commerce", href: "/solutions/ecommerce" },
              { icon: <Shield size={16} />, label: "Government", href: "/solutions/government" }
            ]
          },
          {
            heading: "BY USE CASE",
            items: [
              { icon: <Bell size={16} />, label: "Real-time Personalization", href: "/solutions/personalization" },
              { icon: <HelpCircle size={16} />, label: "Fraud Detection", href: "/solutions/fraud-detection" },
              { icon: <Settings size={16} />, label: "IoT Analytics", href: "/solutions/iot-analytics" },
              { icon: <Bookmark size={16} />, label: "Content Recommendation", href: "/solutions/content-recommendation" }
            ]
          }
        ],
        image: { src: "/api/placeholder/200/150", alt: "Solutions", caption: "Industry-specific solutions built for scale" }
      },
      resources: {
        sections: [
          {
            heading: "LEARN",
            items: [
              { icon: <Book size={16} />, label: "Documentation", href: "/resources/docs" },
              { icon: <FileText size={16} />, label: "Blog", href: "/resources/blog" },
              { icon: <Users size={16} />, label: "Community", href: "/resources/community" },
              { icon: <HelpCircle size={16} />, label: "Knowledge Base", href: "/resources/knowledge-base" }
            ]
          },
          {
            heading: "SUPPORT",
            items: [
              { icon: <Bell size={16} />, label: "Status", href: "/resources/status" },
              { icon: <Settings size={16} />, label: "Support Portal", href: "/resources/support" },
              { icon: <Shield size={16} />, label: "Security", href: "/resources/security" },
              { icon: <Mail size={16} />, label: "Contact Us", href: "/resources/contact" }
            ]
          }
        ],
        image: { src: "/api/placeholder/200/150", alt: "Resources", caption: "Resources to help you succeed" }
      },
      company: {
        sections: [
          {
            heading: "ABOUT",
            items: [
              { icon: <Users size={16} />, label: "Our Team", href: "/company/team" },
              { icon: <Briefcase size={16} />, label: "Careers", href: "/company/careers" },
              { icon: <Heart size={16} />, label: "Values", href: "/company/values" },
              { icon: <MapPin size={16} />, label: "Locations", href: "/company/locations" }
            ]
          },
          {
            heading: "CONNECT",
            items: [
              { icon: <Phone size={16} />, label: "Contact", href: "/company/contact" },
              { icon: <Bell size={16} />, label: "Press", href: "/company/press" },
              { icon: <Mail size={16} />, label: "Partners", href: "/company/partners" },
              { icon: <Globe size={16} />, label: "Events", href: "/company/events" }
            ]
          }
        ],
        image: { src: "/api/placeholder/200/150", alt: "Company", caption: "Join us in our mission" }
      }
    };

    const data = dropdownData[type];
    if (!data) return null;

    return (
      <div className="dropdown-content">
        {data.sections.map((section, idx) => (
          <motion.div 
            key={idx} 
            className="dropdown-section"
            variants={itemVariants}
          >
            <h3 className="dropdown-heading">{section.heading}</h3>
            <ul className="dropdown-list">
              {section.items.map((item, itemIdx) => (
                <motion.li 
                  key={itemIdx}
                  variants={itemVariants}
                  custom={itemIdx}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <a href={item.href}>
                    <span className="dropdown-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
        {data.image && (
          <motion.div 
            className="dropdown-image"
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
          >
            <motion.img 
              src={data.image.src} 
              alt={data.image.alt} 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 4px 15px rgba(118, 171, 174, 0.3)"
              }}
            />
            <p>{data.image.caption}</p>
          </motion.div>
        )}
      </div>
    );
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
              <img src="/api/placeholder/160/40" alt="Logo" className="logo" />
            </motion.a>
          </motion.div>

          <div className="navbar-center">
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
                        {renderDropdownContent(item)}
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
                    onClick={() => setIsLoggedIn(true)}
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
          </div>

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
                    src="/api/placeholder/40/40" 
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
                      <div className="profile-content">
                        <motion.div 
                          className="profile-header"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <motion.img 
                            src="/api/placeholder/60/60" 
                            alt="User Profile" 
                            className="profile-image-large" 
                            whileHover={{ scale: 1.05, borderColor: "#EEEEEE" }}
                          />
                          <div className="profile-info">
                            <h3>John Doe</h3>
                            <p>john.doe@example.com</p>
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
                            onClick={() => setIsLoggedIn(false)}
                            variants={itemVariants}
                            whileHover={{ x: 5, backgroundColor: "rgba(255, 77, 77, 0.1)", transition: { duration: 0.2 } }}
                          >
                            <LogOut size={16} />
                            <span>Log Out</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <>
                <motion.button 
                  className="login-button"
                  onClick={() => setIsLoggedIn(true)}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Login
                </motion.button>
                <motion.a 
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
                </motion.a>
              </>
            )}
          </motion.div>

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
        </motion.div>
      </motion.header>
    </div>
  );
};

export default Navbar;
