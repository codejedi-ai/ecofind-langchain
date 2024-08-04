import React from 'react';
import './Chatbox.css';
import sendIcon from './images/send.svg';

// Define a chatbox function in JavaScript
function Chatbox() {
    const handleHomeClick = () => {
        window.location.href = 'http://localhost:3000'; // Redirect to the home page
    };

    return (
        <main>
            <section className="chatbot-container">
                <div className="chatbot-header">
                    <p className="heading">EcoFind Personal Chatbot</p>
                    <button className="home-btn" onClick={handleHomeClick}>
                        Back
                    </button>
                </div>
                <div className="chatbot-conversation-container" id="chatbot-conversation-container">
                </div>
                <form id="form" className="chatbot-input-container">
                    <input name="user-input" type="text" id="user-input" placeholder="Type your message..." required />
                    <button id="submit-btn" className="submit-btn">
                        <img
                            src={sendIcon}
                            className="send-btn-icon"
                            alt="Send"
                        />
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Chatbox;
