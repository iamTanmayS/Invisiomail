import React from 'react';
import "../../Styles/Dashboard/Loadingscreen.css"

function LoadingScreen({ isLoading }) {
    // We use CSS to hide it based on a parent class or direct style
    // rather than conditional rendering to allow for fade-out transitions
    return (
        <div className={`loading-screen ${!isLoading ? 'hidden' : ''}`}>
            <img className="loader" src="https://res.cloudinary.com/df4hdywqy/image/upload/v1745261457/motion-blur-2_jfccmy.svg"></img>
        </div>
    );
}
export default LoadingScreen;