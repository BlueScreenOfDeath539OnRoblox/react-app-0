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
    const messagesContainerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
                        // Trigger scroll after state update
                        setTimeout(scrollToBottom, 0);
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

    const handleSendMessage = async () => {
        if ((messageInput.trim() || selectedFile) && wsRef.current && connected) {
            let newMessage = {
                username: username || 'Anonymous',
                text: messageInput,
                timestamp: new Date().toLocaleTimeString()
            };

            if (selectedFile) {
                // Make sure we have the uploadPreview data
                if (!uploadPreview?.url && (getFileType(selectedFile) === 'image' || getFileType(selectedFile) === 'video')) {
                    try {
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
                } else {
                    newMessage.file = {
                        url: uploadPreview?.url,
                        name: selectedFile.name,
                        type: getFileType(selectedFile),
                        mimeType: selectedFile.type
                    };
                }
            }

            // Send message through WebSocket
            wsRef.current.send(JSON.stringify(newMessage));

            setMessageInput('');
            setSelectedFile(null);
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
                                    <img src={message.file.url} alt={message.file.name} className="uploaded-image" />
                                )}
                                {message.file.type === 'video' && (
                                    <video controls className="uploaded-video">
                                        <source src={message.file.url} type={message.file.mimeType} />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                {message.file.type === 'other' && (
                                    <div className="file-info">
                                        <span className="file-icon">📎</span>
                                        <span className="file-name">{message.file.name}</span>
                                    </div>
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
