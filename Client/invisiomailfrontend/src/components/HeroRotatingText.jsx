// src/components/HeroTextDisplay.jsx (Enhanced with Framer Motion and Gradient Glow)
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import RotatingText from "../components/Herosectiontext"; // Adjust path as needed

const HeroTextDisplay = ({
  staticTextStart = "We make",
  staticTextEnd = "",
  rotatingTexts = ["emails invisible", "privacy possible", "security simple"],
  // --- Styling Props ---
  staticTextStyle = "text-3xl md:text-4xl lg:text-6xl font-bold text-[#EEEEEE]",
  // Added more horizontal and vertical padding (px-8 py-4)
  rotatingTextContainerStyle = "block bg-[#31363F] text-[#EEEEEE] text-3xl md:text-4xl lg:text-6xl font-extrabold px-8 py-4 rounded-md overflow-hidden",
  // --- Animation Props (passed down) ---
  animationInitial = { y: "100%", opacity: 0 },
  animationAnimate = { y: 0, opacity: 1 },
  animationExit = { y: "-100%", opacity: 0 },
  animationTransition = { type: "spring", damping: 12, stiffness: 170 },
  staggerDuration = 0.04,
  staggerFrom = "first",
  rotationInterval = 2500,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!Array.isArray(rotatingTexts) || rotatingTexts.length === 0) {
    console.warn("HeroTextDisplay requires a non-empty array for 'rotatingTexts' prop.");
    return null;
  }

  // Enhanced container animation variants
  const containerVariants = {
    initial: { scale: 0.98, opacity: 0.9 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.03,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Glow animation variants
  const glowVariants = {
    initial: { 
      opacity: 0.7,
      scale: 0.98
    },
    animate: { 
      opacity: 0.8,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      opacity: 1,
      scale: 1.05,
      filter: "blur(15px)",
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    // Added vertical margin and padding (my-8 py-2)
    <div className="flex flex-wrap items-baseline space-x-4 md:space-x-5 my-8 py-2">
      {/* Static Text Start */}
      {staticTextStart && (
        <motion.span 
          className={`${staticTextStyle} mr-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {staticTextStart}
        </motion.span>
      )}

      {/* Animated Rotating Text Container */}
      <motion.div
        // Added margin around the container (m-2)
        className="relative m-2"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={containerVariants}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glow Effect - Behind Text */}
        <motion.div 
          // Increased the inset for a larger glow area
          className="absolute inset-[-4px] rounded-lg z-0"
          variants={glowVariants}
          style={{
            background: `linear-gradient(135deg, #76ABAE 0%, #a1ced0 25%, #76ABAE 50%, #31363F 75%, #76ABAE 100%)`,
            backgroundSize: isHovered ? "200% 200%" : "100% 100%",
            filter: "blur(12px)",
            opacity: 0.8,
            transition: "background-position 0.8s ease-in-out",
            backgroundPosition: isHovered ? "right bottom" : "left top",
          }}
        />

        {/* Border Gradient */}
        <motion.div 
          className="absolute inset-0 rounded-md z-1"
          style={{
            background: `linear-gradient(135deg, #76ABAE 0%, #a1ced0 25%, #76ABAE 50%, #31363F 75%, #76ABAE 100%)`,
            backgroundSize: isHovered ? "200% 200%" : "100% 100%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            // Increased padding for a thicker border
            padding: "3px",
            transition: "background-position 0.8s ease-in-out",
            backgroundPosition: isHovered ? "right bottom" : "left top",
          }}
        />

        {/* RotatingText Component */}
        <RotatingText
          texts={rotatingTexts}
          // Added additional padding classes to the main container
          mainClassName={`relative z-[2] ${rotatingTextContainerStyle}`}
          // Pass down animation props
          initial={animationInitial}
          animate={animationAnimate}
          exit={animationExit}
          transition={animationTransition}
          staggerDuration={staggerDuration}
          staggerFrom={staggerFrom}
          rotationInterval={rotationInterval}
          // Internal structure classes
          splitLevelClassName="overflow-hidden"
          elementLevelClassName="inline-block px-1" // Added horizontal padding to each text element
        />
      </motion.div>

      {/* Static Text End */}
      {staticTextEnd && (
        <motion.span 
          className={`${staticTextStyle} ml-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {staticTextEnd}
        </motion.span>
      )}
    </div>
  );
};

export default HeroTextDisplay;