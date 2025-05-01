import '../Styles/LoginPage.css';

import React, { useEffect } from 'react';

import { FcGoogle } from "react-icons/fc";
import LoginwithGoogleButton from '../components/Buttons/LoginwithGoogleButton';
import { loginWithGoogle } from '../Api/Authentication';
import { motion } from 'framer-motion';

const LoginPage = () => {
    // Your illustrations import would go here
    const illustrations = {
        illustration1: "https://res.cloudinary.com/df4hdywqy/image/upload/v1745175461/Larana_Cake_Bake_pyj3ue.svg",
        illustration2: "https://res.cloudinary.com/df4hdywqy/image/upload/v1745176777/auto-1986310_1280_dalnuu.webp",
        illustration3: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1745176590/watercolor-5380750_1280_iunyti.webp',
        illustration4: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1745176765/fox-7405603_1280_o9jczm.png',
        illustration5: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1745176678/cassette-7001171_1280_drg5l9.webp',
        illustration6: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1745176881/butterfly-161156_1280_rxhg3i.webp',
    };
    const handleLoginWithGoogleButton = async() =>{
        loginWithGoogle()
    }
    useEffect(() => {
        document.body.style.backgroundColor = '#222831';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1.5 } }
    };

    const floatingAnimation = {
        initial: { y: 0 },
        animate: (custom) => ({
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                delay: custom * 0.2,
                ease: "easeInOut"
            }
        })
    };

    const rotateAnimation = {
        initial: { rotate: 0 },
        animate: (custom) => ({
            rotate: custom % 2 === 0 ? [0, 10, 0] : [0, -10, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: custom * 0.3,
                ease: "easeInOut"
            }
        })
    };

    // Illustration component for reusability
    const AnimatedIllustration = ({ src, className, custom, variant }) => (
        <motion.div
            className={`illustration ${className}`}
            custom={custom}
            variants={variant}
            initial="initial"
            animate="animate"
        >
            <img src={src} alt="decoration" />
        </motion.div>
    );

    return (
        <div className="login-container">
            {/* Background Illustrations */}
            <div className="background-illustrations">
                <AnimatedIllustration
                    src={illustrations.illustration1}
                    className="illustration-1"
                    custom={1}
                    variant={floatingAnimation}
                />
                <AnimatedIllustration
                    src={illustrations.illustration2}
                    className="illustration-2"
                    custom={2}
                    variant={rotateAnimation}
                />
                <AnimatedIllustration
                    src={illustrations.illustration3}
                    className="illustration-3"
                    custom={3}
                    variant={floatingAnimation}
                />
                <AnimatedIllustration
                    src={illustrations.illustration4}
                    className="illustration-4"
                    custom={4}
                    variant={rotateAnimation}
                />
                <AnimatedIllustration
                    src={illustrations.illustration5}
                    className="illustration-5"
                    custom={5}
                    variant={floatingAnimation}
                />
                <AnimatedIllustration
                    src={illustrations.illustration6}
                    className="illustration-6"
                    custom={6}
                    variant={rotateAnimation}
                />
            </div>

            {/* Login Card */}
            <motion.div
                className="login-card"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="login-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Welcome Back
                </motion.h1>

                <motion.p
                    className="login-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    Sign in to continue to your account
                </motion.p>

                <motion.div
                    className="google-button-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <LoginwithGoogleButton 
                    buttonTitle = "Login With Google"
                    buttonFunctionality = {handleLoginWithGoogleButton}
                    Icon={FcGoogle}/>
                </motion.div>

                <motion.div
                    className="footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                >
                    <p>© 2025 invisioMail</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;