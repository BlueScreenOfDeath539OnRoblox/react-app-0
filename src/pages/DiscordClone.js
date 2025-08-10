import { useState, useRef, useEffect, useCallback } from 'react';
import './TodoList.css';
import config from '../config';

const RECONNECT_DELAY = 2000;

function DiscordClone() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = useCallback(() => {
        try {
            wsRef.current = new WebSocket(config.websocketUrl);

            wsRef.current.onopen = () => {
                console.log('Connected to server');
                setConnected(true);
                setConnectionStatus('Connected');
                // Clear any reconnection timeout
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages, message];
                        return newMessages.slice(-100);
                    });
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            wsRef.current.onclose = () => {
                console.log('Disconnected from server');
                setConnected(false);
                setConnectionStatus('Reconnecting...');
                // Try to reconnect after delay
                reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('Connection error, retrying...');
            };

        } catch (error) {
            console.error('Connection error:', error);
            setConnectionStatus('Connection error, retrying...');
            // Try to reconnect after delay
            reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const handleSendMessage = () => {
        if ((messageInput.trim() || selectedFile) && wsRef.current && connected) {
            const newMessage = {
                username: username || 'Anonymous',
                text: messageInput,
                file: selectedFile,
                timestamp: new Date().toLocaleTimeString()
            };

            // Send message through WebSocket
            wsRef.current.send(JSON.stringify(newMessage));

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
                <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
                    {connectionStatus}
                </span>
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
