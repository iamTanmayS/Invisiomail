import "../../Styles/Toaster/GenerateMailToaster.css"; // Assuming CSS file name might also change

import { FaCheck, FaChevronDown, FaCopy, FaPaperPlane, FaTimes } from 'react-icons/fa';
import React, { useState } from 'react';

import { CgSpinner } from 'react-icons/cg';
import generateEmail from '../../Api/AiGeneration'; // Ensure this path is correct

const GenerateMailToaster = ({ onGenerateComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [emotion, setEmotion] = useState('friendly');
    const [length, setLength] = useState('medium');
    const [recipient, setRecipient] = useState('team@company.com');
    const [subject, setSubject] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [showEmotionDropdown, setShowEmotionDropdown] = useState(false);
    const [showLengthDropdown, setShowLengthDropdown] = useState(false);
    const [copied, setCopied] = useState(false);

    const emotions = [
        'friendly', 'professional', 'urgent', 'enthusiastic',
        'formal', 'casual', 'grateful', 'assertive'
    ];

    const lengths = ['short', 'medium', 'long'];

    const handleGenerate = async () => {
        if (!message) return;
        setIsLoading(true);
        try {
            const emailData = {
                recipient,
                subject: subject || 'No Subject',
                message,
                emotion,
                length
            };
            const emailContent = await generateEmail(emailData);
            setGeneratedEmail(emailContent);
            if (onGenerateComplete) {
                onGenerateComplete(emailContent);
            }
        } catch (error) {
            console.error('Failed to generate email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const closeToaster = () => {
        setIsOpen(false);
        setTimeout(() => {
            setGeneratedEmail('');
            setMessage('');
            setSubject('');
        }, 300); // Match CSS transition duration
    };

    const toggleDropdown = (dropdown) => {
        if (dropdown === 'emotion') {
            setShowEmotionDropdown(!showEmotionDropdown);
            setShowLengthDropdown(false);
        } else {
            setShowLengthDropdown(!showLengthDropdown);
            setShowEmotionDropdown(false);
        }
    };

    const selectOption = (type, value) => {
        if (type === 'emotion') {
            setEmotion(value);
            setShowEmotionDropdown(false);
        } else {
            setLength(value);
            setShowLengthDropdown(false);
        }
    };

    return (
        <div className="email-toaster-containerToaster">
            {/* Toaster Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="toaster-buttonToaster"
            >
                <FaPaperPlane className="button-iconToaster" />
                Generate Email
            </button>

            {/* Toaster Panel */}
            <div className={`toaster-panelToaster ${isOpen ? 'open' : ''}`}>
                <div className="toaster-headerToaster">
                    <h3>Email Generator</h3>
                    <button onClick={closeToaster} className="close-buttonToaster">
                        <FaTimes />
                    </button>
                </div>

                <div className="toaster-contentToaster">
                    {!generatedEmail ? (
                        <>
                            <div className="form-groupToaster">
                                <label>Recipient</label>
                                <input
                                    type="email"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="recipient@example.com"
                                />
                            </div>

                            <div className="form-groupToaster">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Email subject"
                                />
                            </div>

                            <div className="dropdowns-containerToaster">
                                <div className="dropdownToaster">
                                    <label>Emotion</label>
                                    <div className="dropdown-selectorToaster">
                                        <button
                                            className="dropdown-buttonToaster"
                                            onClick={() => toggleDropdown('emotion')}
                                        >
                                            {emotion}
                                            <FaChevronDown className={`dropdown-iconToaster ${showEmotionDropdown ? 'rotated' : ''}`} />
                                        </button>
                                        {showEmotionDropdown && (
                                            <div className="dropdown-menuToaster">
                                                {emotions.map((item) => (
                                                    <div
                                                        key={item}
                                                        className={`dropdown-itemToaster ${emotion === item ? 'selected' : ''}`}
                                                        onClick={() => selectOption('emotion', item)}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="dropdownToaster">
                                    <label>Length</label>
                                    <div className="dropdown-selectorToaster">
                                        <button
                                            className="dropdown-buttonToaster"
                                            onClick={() => toggleDropdown('length')}
                                        >
                                            {length}
                                            <FaChevronDown className={`dropdown-iconToaster ${showLengthDropdown ? 'rotated' : ''}`} />
                                        </button>
                                        {showLengthDropdown && (
                                            <div className="dropdown-menuToaster">
                                                {lengths.map((item) => (
                                                    <div
                                                        key={item}
                                                        className={`dropdown-itemToaster ${length === item ? 'selected' : ''}`}
                                                        onClick={() => selectOption('length', item)}
                                                    >
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-groupToaster">
                                <label>Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="What do you want your email to be about?"
                                    rows="4"
                                />
                            </div>

                            <button
                                className="generate-buttonToaster"
                                onClick={handleGenerate}
                                disabled={isLoading || !message}
                            >
                                {isLoading ? (
                                    <>
                                        <CgSpinner className="spinnerToaster" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="button-iconToaster" />
                                        Generate Email
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="generated-emailToaster">
                            <div className="email-headerToaster">
                                <h4>Generated Email</h4>
                                <button
                                    className="copy-buttonToaster"
                                    onClick={copyToClipboard}
                                    title="Copy to clipboard"
                                >
                                    {copied ? <FaCheck /> : <FaCopy />}
                                </button>
                            </div>
                            <div className="email-contentToaster">
                                {generatedEmail}
                            </div>
                            <div className="generated-actionsToaster">
                                <button
                                    className="back-buttonToaster"
                                    onClick={() => setGeneratedEmail('')}
                                >
                                    Generate Another
                                </button>
                                <button
                                    className="close-button-textToaster"
                                    onClick={closeToaster}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateMailToaster;