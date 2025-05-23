import "../Styles/Home.css"

import { loginWithGoogle, logout } from '../Api/Authentication'

import GetStartedbuttonfunctionality from '../utils/Getstartedbuttonfunctionality';
import HeroSection from '../components/HerosectionBackground/HeroSection'
import HeroTextDisplay from '../components/HeroRotatingText'
import Herosectionbutton from '../components/StyledComponent/Herosectionbutton'
import React from 'react'
import { createRawMail } from '../Api/EmailsFunctions'
import { fetchUser } from '../Redux/Slice/authslice';
import { motion } from 'framer-motion'
import { selectIsAuthenticated } from "../Redux/Slice/authslice";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";

function Home() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const myRotatingWords = ["Code", "Ideas", "Solutions", "Apps"];
  
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      // Will redirect to Google OAuth
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <HeroSection>
      <div className="hero-content-container">
        {/* Hero Section - This will be at the top */}
        <div className="hero-section-top">
          <motion.div 
            className="hero-text-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <HeroTextDisplay
              staticTextStart="We Build"
              rotatingTexts={myRotatingWords}
              staticTextEnd="!"
            />
          </motion.div>
          
          <motion.h2 
            className="semi-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Transforming your digital vision into reality
          </motion.h2>
          
          {/* Buttons Container - Horizontally aligned */}
          <motion.div 
            className="buttons-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <Herosectionbutton 
              buttontitle="Get Started" 
              herobuttonfunction={()=>GetStartedbuttonfunctionality(isAuthenticated)}
            />
            
            <Herosectionbutton 
              buttontitle="Learn More" 
              herobuttonfunction={() => window.open("https://sprinkle-catamaran-a18.notion.site/InvisioMail-Documentation-1e9ef125dd9380f9890dc750582ff775", "_blank")}
            />
          </motion.div>
        </div>
        <div className="content-section">
   
        </div>
      </div>
    </HeroSection>
  )
}

export default Home