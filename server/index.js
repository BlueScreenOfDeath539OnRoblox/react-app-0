const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({
    server,
    // Enable client connections from any origin
    verifyClient: () => true
});

// Enable CORS for all routes
app.use(cors());

// Add a health check endpoint
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

// Store messages in memory
let messages = [];

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send existing messages to new client
    messages.forEach(message => {
        ws.send(JSON.stringify(message));
    });

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message);

            // Add message to memory
            messages.push(message);

            // Keep only last 100 messages
            if (messages.length > 100) {
                messages = messages.slice(-100);
            }

            // Broadcast to all clients, including sender
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    try {
                        client.send(JSON.stringify(message));
                    } catch (err) {
                        console.error('Error sending to client:', err);
                    }
                }
            });
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
