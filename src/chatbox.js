import React from 'react';
import './chatbox.css';
import logoScrimba from './images/logo-scrimba.svg';
import sendIcon from './images/send.svg';

// Define a chatbox function in JavaScript
function Chatbox() {
    return (
        <main>
            <section className="chatbot-container">
                <div className="chatbot-header">
                    <img src={logoScrimba} className="logo" alt="Logo" />
                    <p className="sub-heading">Knowledge Bank</p>
                </div>
                <div className="chatbot-conversation-container" id="chatbot-conversation-container">
                </div>
                <form id="form" className="chatbot-input-container">
                    <input name="user-input" type="text" id="user-input" required />
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