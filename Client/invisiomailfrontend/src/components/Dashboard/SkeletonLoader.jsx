import "../../Styles/Dashboard/DashboardStyles/SkeletonLoader.scss"

import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3 }) => {
    // Animation variants for shimmer effect
    const shimmerVariants = {
        animate: {
            backgroundPosition: ['0%', '100%'],
            transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
            }
        }
    };

    // Generate array of skeleton emails
    const skeletons = Array.from({ length: count }, (_, i) => i);

    return (
        <div className="skeleton-loader">
            {skeletons.map((_, index) => (
                <motion.div
                    key={index}
                    className="skeleton-item"
                    variants={shimmerVariants}
                   
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.1 }
                    }}
                >
                    <div className="skeleton-checkbox"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-sender"></div>
                        <div className="skeleton-subject"></div>
                        <div className="skeleton-preview"></div>
                    </div>
                    <div className="skeleton-date"></div>
                </motion.div>
            ))}
        </div>
    );
};

export default SkeletonLoader;