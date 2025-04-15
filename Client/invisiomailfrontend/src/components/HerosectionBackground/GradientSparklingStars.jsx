// components/GradientSparklingStars.js
import React, { useMemo } from "react";
import { motion } from "framer-motion"; // Or import from "motion/react"
import { twMerge } from "tailwind-merge";

// Helper function for class names (can be moved to a utils file)
const cn = (...inputs) => {
    return twMerge(inputs);
};

// CSS gradient class names (defined in HeroSection.css)
const gradientClasses = [
    "sparkle-gradient-1",
    "sparkle-gradient-2",
    "sparkle-gradient-3",
    "sparkle-gradient-4",
    "sparkle-gradient-5",
];

export const GradientSparklingStars = ({ count = 100 }) => { // Default count
    // Memoize star generation to avoid recalculation on re-renders
    const stars = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const randomDuration = Math.random() * 4 + 3; // Duration between 3-7 seconds
            const randomDelay = Math.random() * 6;      // Start delay up to 6 seconds
            const randomScaleMin = 0.3;                 // Start smaller
            const randomScaleMax = Math.random() * 0.6 + 0.8; // Scale between 0.8 and 1.4

            return {
                id: `star-${i}`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: `${Math.random() * 1.5 + 0.5}px`, // Size between 0.5px and 2px
                gradientClass: gradientClasses[i % gradientClasses.length],
                animation: {
                    opacity: [0, 1, 1, 0], // Fade in, stay visible, fade out
                    scale: [randomScaleMin, randomScaleMax, randomScaleMin, 0], // Pulse effect
                    transition: {
                        duration: randomDuration,
                        repeat: Infinity,
                        delay: randomDelay,
                        ease: "easeInOut", // Smoother animation easing
                    },
                },
                // Pre-calculate color for direct style application (fallback/alternative)
                color: gradientClasses[i % gradientClasses.length] === "sparkle-gradient-1" ? "rgba(253, 29, 29, 0.6)" :
                       gradientClasses[i % gradientClasses.length] === "sparkle-gradient-2" ? "rgba(29, 253, 122, 0.6)" :
                       gradientClasses[i % gradientClasses.length] === "sparkle-gradient-3" ? "rgba(255, 150, 0, 0.6)" :
                       gradientClasses[i % gradientClasses.length] === "sparkle-gradient-4" ? "rgba(0, 100, 255, 0.6)" :
                       "rgba(255, 20, 147, 0.6)",
            };
        });
    }, [count]); // Recalculate only if count changes

    return (
        // Container for stars, positioned absolutely behind content
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map(star => (
                <motion.span
                    key={star.id}
                    initial={{ opacity: 0, scale: 0 }} // Initial state before animation starts
                    animate={star.animation}
                    style={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        // Apply color directly for potential performance boost or fallback
                         color: star.color,
                    }}
                    // Apply CSS classes for gradient background and sparkle effect
                    className={cn("sparkle", star.gradientClass)}
                />
            ))}
            {/* Optional Noise Overlay */}
            {/* <div className="noise-overlay"></div> */}
        </div>
    );
};