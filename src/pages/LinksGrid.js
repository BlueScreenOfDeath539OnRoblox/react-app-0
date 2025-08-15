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

    const correctPasscode = 'reactjsforthewin';

    const handlePasscodeSubmit = (e) => {
        e.preventDefault();
        if (passcode === correctPasscode) {
            setIsAuthenticated(true);
            setShowError(false);
        } else {
            setShowError(true);
            setPasscode('');
        }
    };

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(config.websocketUrl);

            ws.onopen = () => {
                setConnected(true);
                setStatus('Connected');

                // Request existing links
                ws.send(JSON.stringify({ header: 'LINKS', type: 'request_links' }));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.header === 'LINKS') {
                        if (message.type === 'link') {
                            // Add new link only if it doesn't already exist
                            setLinks(prevLinks => {
                                const exists = prevLinks.some(link =>
                                    link.url === message.url &&
                                    link.timestamp === message.timestamp
                                );
                                if (!exists) {
                                    return [...prevLinks, message];
                                }
                                return prevLinks;
                            });
                        } else if (message.type === 'links_list') {
                            // Replace entire links array with new list
                            setLinks([...message.links]);
                        }
                    }
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            ws.onclose = () => {
                setConnected(false);
                setStatus('Disconnected - Reconnecting...');
                // Clear links before reconnecting to prevent duplicates
                setLinks([]);
                setTimeout(connect, 2000);
            };

            ws.onerror = () => {
                setStatus('Connection error');
            };

            return () => {
                ws.close();
            };
        } catch (error) {
            setStatus('Connection error');
            setTimeout(connect, 2000);
        }
    }, []);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleDeleteClick = (e, link) => {
        e.stopPropagation(); // Prevent triggering the link click
        setLinkToDelete(link);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        const ws = new WebSocket(config.websocketUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                header: 'LINKS',
                type: 'delete_link',
                url: linkToDelete.url,
                timestamp: linkToDelete.timestamp
            }));
            setShowDeleteConfirm(false);
            setLinkToDelete(null);
            ws.close();
        };
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
            {!isAuthenticated ? (
                <div className="passcode-overlay">
                    <div className="passcode-container">
                        <h2>Enter Passcode</h2>
                        <form onSubmit={handlePasscodeSubmit}>
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                placeholder="Enter passcode"
                                className={showError ? 'error' : ''}
                            />
                            {showError && (
                                <div className="error-message">Incorrect passcode</div>
                            )}
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            ) : null}

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
                        onClick={isAuthenticated ? () => handleLinkClick(link.url) : undefined}
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
        </div>
    );
}

export default LinksGrid;
