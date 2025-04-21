// NavbarComponents/DropdownContent.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from './Animationconstants';
import { dropdownLinks } from './dropdownData';


const DropdownContent = ({ type }) => {
    const data = dropdownLinks[type];
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

export default DropdownContent;