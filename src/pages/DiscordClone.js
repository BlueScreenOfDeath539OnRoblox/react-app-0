import { useState, useRef, useEffect, useCallback } from 'react';
import './DiscordClone.css';
import config from '../config';

const RECONNECT_DELAY = 2000;

function DiscordClone() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');
    const fileInputRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    // Helper function to get file type
    const getFileType = (file) => {
        if (!file) return null;
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        return 'other';
    };

    // Helper function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Load saved user profile on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
        }
    }, []);

    const connect = useCallback(() => {
        try {
            wsRef.current = new WebSocket(config.websocketUrl());

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
                    // Only process messages with chat header
                    if (message.header === 'CHAT') {
                        setMessages(prevMessages => {
                            const newMessages = [...prevMessages, message];
                            // Trigger scroll after state update
                            setTimeout(scrollToBottom, 0);
                            return newMessages.slice(-100);
                        });
                    }
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

    const [isEnterPressed, setIsEnterPressed] = useState(false);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const isJoinButtonClicked = e.type === 'submit';

        if (trimmedUsername && (isEnterPressed || isJoinButtonClicked)) {
            setUsername(trimmedUsername);
            setUserProfile({ name: trimmedUsername });
            localStorage.setItem('chatUsername', trimmedUsername);
            setConnectionStatus('Connecting...');
            connect();
            setIsEnterPressed(false);  // Reset the flag
        }
    };

    useEffect(() => {
        // Cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const handleSendMessage = async () => {
        if ((messageInput.trim() || selectedFile) && wsRef.current && connected) {
            let newMessage = {
                header: 'CHAT',
                username: username || 'Anonymous',
                text: messageInput,
                timestamp: new Date().toLocaleTimeString()
            };

            if (selectedFile) {
                try {
                    // Always convert file to base64, regardless of type
                    const base64 = await fileToBase64(selectedFile);
                    newMessage.file = {
                        url: base64,
                        name: selectedFile.name,
                        type: getFileType(selectedFile),
                        mimeType: selectedFile.type
                    };
                } catch (error) {
                    console.error('Error converting file to base64:', error);
                    return;
                }
            }

            // Send message through WebSocket
            wsRef.current.send(JSON.stringify(newMessage));

            setMessageInput('');
            setSelectedFile(null);
            setUploadPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            if (getFileType(file) === 'image' || getFileType(file) === 'video') {
                try {
                    const base64 = await fileToBase64(file);
                    setUploadPreview({
                        type: getFileType(file),
                        url: base64,
                        name: file.name
                    });
                } catch (error) {
                    console.error('Error creating preview:', error);
                }
            } else {
                setUploadPreview({
                    type: 'other',
                    name: file.name
                });
            }
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
                {!connected ? (
                    <div className="login-options">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams({
                                    client_id: config.github.clientId,
                                    redirect_uri: config.github.redirectUri,
                                    scope: 'read:user',
                                    state: Math.random().toString(36).substring(7)
                                });
                                window.location.href = `${config.github.authorizationUrl}?${params}`;
                            }}
                            className="github-signin-button">
                            <img src="https://github.com/favicon.ico" alt="GitHub logo" />
                            Sign in with GitHub
                        </button>
                        <div className="or-divider">or</div>
                        <form onSubmit={handleUsernameSubmit} className="username-form">
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key.toLowerCase() === "enter") {
                                        e.preventDefault();
                                        setIsEnterPressed(true);
                                        handleUsernameSubmit(e);
                                    }
                                }}
                                className="username-input"
                            />
                            <button type="submit" className="username-submit">
                                Join Chat
                            </button>
                        </form>
                    </div>
                ) : !userProfile ? (
                    <div className="connecting-state">
                        <div className="user-profile">
                            {userProfile?.picture && (
                                <img src={userProfile.picture} alt="Profile" className="profile-picture" />
                            )}
                            <span className="username-display">{username}</span>
                        </div>
                        <div className="connecting-message">
                            <div className="spinner"></div>
                            <span>{connectionStatus}</span>
                        </div>
                    </div>
                ) : (
                    <div className="user-profile">
                        {userProfile?.picture && (
                            <img src={userProfile.picture} alt="Profile" className="profile-picture" />
                        )}
                        <span className="username-display">{username}</span>
                        <span className={`connection-status connected`}>
                            {connectionStatus}
                        </span>
                    </div>
                )}
            </div>

            <div className="messages-container" ref={messagesContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className="message-header">
                            <span className="username">{message.username}</span>
                            <span className="timestamp">{message.timestamp}</span>
                        </div>
                        {message.text && <div className="message-text">{message.text}</div>}
                        {message.file && (
                            <div className="message-file">
                                {message.file.type === 'image' && (
                                    <a href={message.file.url} target="_blank" rel="noopener noreferrer">
                                        <img src={message.file.url} alt={message.file.name} className="uploaded-image" />
                                    </a>
                                )}
                                {message.file.type === 'video' && (
                                    <video controls className="uploaded-video" preload="metadata">
                                        <source src={message.file.url} type={message.file.mimeType} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {message.file.type === 'other' && (
                                    <a href={message.file.url} download={message.file.name} className="file-info">
                                        <span className="file-icon">📎</span>
                                        <span className="file-name">{message.file.name}</span>
                                    </a>
                                )}
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
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                            className="file-input"
                            id="file-input"
                        />
                        {uploadPreview && (
                            <div className="upload-preview">
                                {uploadPreview.type === 'image' && (
                                    <img src={uploadPreview.url} alt={uploadPreview.name} className="preview-image" />
                                )}
                                {uploadPreview.type === 'video' && (
                                    <video controls className="preview-video">
                                        <source src={uploadPreview.url} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {uploadPreview.type === 'other' && (
                                    <div className="file-info">
                                        <span className="file-icon">📎</span>
                                        <span className="file-name">{uploadPreview.name}</span>
                                    </div>
                                )}
                            </div>
                        )}
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
