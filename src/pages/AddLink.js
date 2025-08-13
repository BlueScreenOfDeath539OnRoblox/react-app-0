import { useState } from 'react';
import config from '../config';
import './AddLink.css';

function AddLink() {
    const [linkName, setLinkName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const ws = new WebSocket(config.websocketUrl);

            ws.onopen = () => {
                const message = {
                    type: 'link',
                    name: linkName,
                    url: url,
                    description: description,
                    timestamp: new Date().toISOString()
                };

                ws.send(JSON.stringify(message));

                // Clear form
                setLinkName('');
                setUrl('');
                setDescription('');
                setStatus('Link added successfully!');

                // Close connection after sending
                ws.close();
            };

            ws.onerror = () => {
                setStatus('Error adding link. Please try again.');
            };
        } catch (error) {
            setStatus('Error connecting to server. Please try again.');
        }
    };

    return (
        <div className="add-link-container">
            <h2>Add New Link</h2>
            <form onSubmit={handleSubmit} className="add-link-form">
                <div className="form-group">
                    <label htmlFor="linkName">Name:</label>
                    <input
                        type="text"
                        id="linkName"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        required
                        placeholder="Enter a name for the link"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="url">URL:</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        placeholder="Enter the URL"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Enter a description"
                    />
                </div>
                <button type="submit" className="submit-button">Add Link</button>
            </form>
            {status && <div className="status-message">{status}</div>}
        </div>
    );
}

export default AddLink;
