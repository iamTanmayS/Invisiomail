import React, { useEffect, useRef } from 'react';
import "../../Styles/Dashboard/Settingspanel.css"

function SettingsPanel({ isOpen, onClose }) {
    const panelRef = useRef(null);

    // Close panel on Escape key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Focus trapping could be added here for accessibility

    return (
        <>
            {/* Backdrop */}
            <div
                className={`settings-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Panel */}
            <section
                ref={panelRef}
                className={`settings-panel ${isOpen ? 'open' : ''}`}
                aria-labelledby="settings-title" // Assuming h2 has this id
                role="dialog" // Or complementary if not modal
                aria-modal={isOpen} // Set true if it behaves like a modal
            >
                <div className="settings-content">
                    <h2 id="settings-title" className="settings-title">Settings</h2>
                    {/* Add settings controls here */}
                    <button onClick={onClose} style={{ marginTop: '1rem' }}>Close Panel</button>
                </div>
            </section>
        </>
    );
}

export default SettingsPanel;