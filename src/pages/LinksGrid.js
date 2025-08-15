import { useState, useEffect, useCallback } from 'react';
import config from '../config';
import './LinksGrid.css';

function LinksGrid() {
    const [links, setLinks] = useState([]);
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState('Connecting...');
    const [passcode, setPasscode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [linkToDelete, setLinkToDelete] = useState(null);
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const correctPasscode = 'reactjsforthewin';

    const handlePasscodeSubmit = (e) => {
        e.preventDefault();
        setIsAuthenticated(passcode === correctPasscode);
        if (passcode !== correctPasscode) {
            setShowError(true);
            setPasscode('');
        } else {
            setShowError(false);
        }
        // Remove the passcode overlay regardless of the result
        document.querySelector('.passcode-overlay').style.display = 'none';
    };

    const [ws, setWs] = useState(null);

    const connect = useCallback(() => {
        if (ws) {
            ws.close();
        }

        try {
            const newWs = new WebSocket(config.websocketUrl);

            newWs.onopen = () => {
                setConnected(true);
                setStatus('Connected');
                console.log('WebSocket connected');

                // Request existing links
                newWs.send(JSON.stringify({ header: 'LINKS', type: 'request_links' }));
            };

            newWs.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('Received WebSocket message:', message);

                    if (message.header === 'LINKS') {
                        if (message.type === 'link') {
                            // Add new link only if it doesn't already exist
                            setLinks(prevLinks => {
                                const exists = prevLinks.some(link =>
                                    link.url === message.url &&
                                    link.timestamp === message.timestamp
                                );
                                if (!exists) {
                                    console.log('Adding new link:', message);
                                    return [...prevLinks, message];
                                }
                                return prevLinks;
                            });
                        } else if (message.type === 'links_list') {
                            console.log('Updating entire links list:', message.links);
                            // Replace entire links array with new list
                            setLinks(message.links || []);
                        } else if (message.type === 'delete_link') {
                            console.log('Processing delete for:', message.url);
                            // Remove the link from local state
                            setLinks(prevLinks => {
                                const updatedLinks = prevLinks.filter(link =>
                                    link.url !== message.url || link.timestamp !== message.timestamp
                                );
                                console.log('Updated links after delete:', updatedLinks);
                                return updatedLinks;
                            });

                            // Clear selected URL if it was deleted
                            if (selectedUrl === message.url) {
                                setSelectedUrl(null);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            newWs.onclose = () => {
                setConnected(false);
                setStatus('Disconnected - Reconnecting...');
                setWs(null);
                // Clear links before reconnecting to prevent duplicates
                setLinks([]);
                setTimeout(connect, 2000);
            };

            newWs.onerror = (error) => {
                console.error('WebSocket error:', error);
                setStatus('Connection error');
            };

            setWs(newWs);
            return () => {
                if (newWs) {
                    newWs.close();
                }
            };
        } catch (error) {
            setStatus('Connection error');
            setTimeout(connect, 2000);
        }
    }, []);

    // Effect for WebSocket connection management
    useEffect(() => {
        console.log('Initializing WebSocket connection...');
        const cleanup = connect();

        // Cleanup function
        return () => {
            console.log('Cleaning up WebSocket connection...');
            if (cleanup) cleanup();
            if (ws) {
                console.log('Closing existing WebSocket connection...');
                ws.close();
                setWs(null);
            }
        };
    }, [connect]);

    const handleLinkClick = (url) => {
        setSelectedUrl(url);
    };

    const handleFullscreen = () => {
        const embedContainer = document.getElementById('embed-container');
        if (embedContainer) {
            if (!document.fullscreenElement) {
                embedContainer.requestFullscreen();
                setIsFullscreen(true);
            } else {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleDeleteClick = (e, link) => {
        e.stopPropagation(); // Prevent triggering the link click
        console.log('Delete clicked for link:', link);
        setLinkToDelete(link);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        try {
            if (!linkToDelete || !linkToDelete.url || !linkToDelete.timestamp) {
                console.error('Invalid link to delete:', linkToDelete);
                return;
            }

            console.log('Sending delete request for:', linkToDelete);

            // Send delete request to server
            ws.send(JSON.stringify({
                header: 'LINKS',
                type: 'delete_link',
                url: linkToDelete.url,
                timestamp: linkToDelete.timestamp,
                name: linkToDelete.name, // Include additional fields
                description: linkToDelete.description
            }));

            // Reset delete confirmation state
            setShowDeleteConfirm(false);
            setLinkToDelete(null);

            // Request updated list from server
            ws.send(JSON.stringify({
                header: 'LINKS',
                type: 'request_links'
            }));

        } catch (error) {
            console.error('Error sending delete request:', error);
        }
    };

    return (
        <div className="links-grid-container">
            {showDeleteConfirm && (
                <div className="passcode-overlay">
                    <div className="passcode-container">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this link?</p>
                        <div className="confirm-buttons">
                            <button onClick={handleConfirmDelete}>Yes, Delete</button>
                            <button onClick={() => {
                                setShowDeleteConfirm(false);
                                setLinkToDelete(null);
                            }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="passcode-overlay">
                <div className="passcode-container">
                    <h2>Enter Passcode</h2>
                    <p>Enter the passcode to view URLs and manage links</p>
                    <form onSubmit={handlePasscodeSubmit}>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="Enter passcode"
                            className={showError ? 'error' : ''}
                        />
                        {showError && (
                            <div className="error-message">Incorrect passcode. You can still view the links, but URLs will be hidden.</div>
                        )}
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>

            <h2>Links Collection</h2>
            <div className="connection-status">
                <span className={connected ? 'connected' : 'disconnected'}>
                    {status}
                </span>
            </div>
            <div className="links-grid">
                {links.map((link, index) => (
                    <div
                        key={index}
                        className="link-card"
                        onClick={isAuthenticated ? () => handleLinkClick(link.url) : () => setShowError(true)}
                    >
                        <h3 className="link-name">{link.name}</h3>
                        <p className="link-description">{link.description}</p>
                        {isAuthenticated && (
                            <>
                                <div className="link-url">{link.url}</div>
                                <div className="link-timestamp">
                                    {new Date(link.timestamp).toLocaleDateString()}
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={(e) => handleDeleteClick(e, link)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <div className="link-locked">
                                <span>🔒 Enter passcode to view URL</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {selectedUrl && (
                <div className="embed-wrapper">
                    <div id="embed-container" className="embed-container">
                        <iframe
                            src={selectedUrl}
                            title="Embedded content"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                    <button
                        className="fullscreen-button"
                        onClick={handleFullscreen}
                    >
                        {isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default LinksGrid;
