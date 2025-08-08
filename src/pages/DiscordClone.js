import { useState, useRef } from 'react';
import './TodoList.css';

function DiscordClone() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSendMessage = () => {
        if (messageInput.trim() || selectedFile) {
            const newMessage = {
                username: username || 'Anonymous',
                text: messageInput,
                file: selectedFile,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages([...messages, newMessage]);
            setMessageInput('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="discord-container">
            <div className="username-section">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="username-input"
                />
            </div>

            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className="message-header">
                            <span className="username">{message.username}</span>
                            <span className="timestamp">{message.timestamp}</span>
                        </div>
                        {message.text && <div className="message-text">{message.text}</div>}
                        {message.file && (
                            <div className="message-file">
                                <img src={message.file} alt="uploaded content" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="input-container">
                <div className="message-input-area">
                    <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <div className="file-upload">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            accept="image/*"
                            className="file-input"
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="file-label">
                            📎
                        </label>
                    </div>
                    <button onClick={handleSendMessage} className="send-button">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiscordClone;
