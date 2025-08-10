const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

// Enable CORS for all routes with specific options
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://bluescreenofdeath539onroblox.github.io'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Create WebSocket server with specific options
const wss = new WebSocket.Server({
    server,
    path: '/ws', // Specific path for WebSocket connections
    verifyClient: (info) => {
        const origin = info.origin || info.req.headers.origin;
        console.log('Connection attempt from origin:', origin);
        return true; // Allow all connections for now
    }
});// Enable CORS for all routes
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

// More detailed error handling for WebSocket
wss.on('error', (error) => {
    console.error('WebSocket Server Error:', error);
});

server.on('error', (error) => {
    console.error('HTTP Server Error:', error);
});

// Add more detailed health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        connections: wss.clients.size,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    wss.close(() => {
        console.log('WebSocket server closed.');
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
});
