import { useState, useEffect, useCallback } from 'react';
import config from '../config';
import './LinksGrid.css';

function LinksGrid() {
    const [links, setLinks] = useState([]);
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState('Connecting...');

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(config.websocketUrl);

            ws.onopen = () => {
                setConnected(true);
                setStatus('Connected');

                // Request existing links
                ws.send(JSON.stringify({ type: 'request_links' }));
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    if (message.type === 'link') {
                        setLinks(prevLinks => [...prevLinks, message]);
                    } else if (message.type === 'links_list') {
                        setLinks(message.links);
                    }
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            ws.onclose = () => {
                setConnected(false);
                setStatus('Disconnected - Reconnecting...');
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

    return (
        <div className="links-grid-container">
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
                        onClick={() => handleLinkClick(link.url)}
                    >
                        <h3 className="link-name">{link.name}</h3>
                        <p className="link-description">{link.description}</p>
                        <div className="link-url">{link.url}</div>
                        <div className="link-timestamp">
                            {new Date(link.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LinksGrid;
