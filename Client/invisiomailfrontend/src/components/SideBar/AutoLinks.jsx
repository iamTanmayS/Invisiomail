import React from 'react';
import "../../Styles/Dashboard/Authorlinks.css"
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa"; // Define these icons

function AuthorLinks() {
    return (
        <div className="author-links-container">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="author-link">
                <span className="sr-only">Twitter</span>
                <FaXTwitter />
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="author-link">
                <span className="sr-only">Github</span>
                <FaGithub className="github-dark" /> {/* Add class if specific styling needed */}
            </a>
        </div>
    );
}


export default AuthorLinks;