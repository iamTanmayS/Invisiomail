import "../../Styles/Dashboard/DashboardStyles/ComposeButton.scss"

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { CiSquarePlus } from "react-icons/ci";
import LoginwithGoogleButton from "../Buttons/LoginwithGoogleButton";
import { useNavigate } from "react-router-dom";

const ComposeButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const handleCompose = () => {
        setIsOpen(!isOpen);
        navigate("/email/send")
    };

    return (
        <div className="compose-button">
           <LoginwithGoogleButton
           buttonTitle="Compose"
           buttonFunctionality={handleCompose}
           Icon={CiSquarePlus}/>    
        </div>
    );
};

export default ComposeButton;