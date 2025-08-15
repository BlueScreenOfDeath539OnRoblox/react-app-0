const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const { connectToDb } = require('./db');
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

// Initialize MongoDB connection
let db;
connectToDb().then(database => {
    db = database;
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

wss.on('connection', async (ws) => {
    console.log('New client connected');

    // Send existing links to new client if db is connected
    if (db) {
        try {
            const linksCollection = db.collection('links');
            const links = await linksCollection.find({}).sort({ createdAt: -1 }).toArray();
            ws.send(JSON.stringify({
                header: 'LINKS',
                type: 'links_list',
                links: links
            }));
        } catch (err) {
            console.error('Error sending initial links:', err);
        }
    }

    ws.on('message', async (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message);

            if (message.header === 'LINKS' && db) {
                const linksCollection = db.collection('links');

                if (message.type === 'delete_link') {
                    try {
                        // Delete the link from MongoDB
                        await linksCollection.deleteOne({
                            url: message.url,
                            timestamp: message.timestamp
                        });

                        // Send updated links list to all clients
                        const updatedLinks = await linksCollection.find({}).sort({ createdAt: -1 }).toArray();
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    header: 'LINKS',
                                    type: 'links_list',
                                    links: updatedLinks
                                }));
                            }
                        });
                    } catch (err) {
                        console.error('Error deleting link:', err);
                        ws.send(JSON.stringify({
                            header: 'ERROR',
                            type: 'delete_failed',
                            message: 'Failed to delete link'
                        }));
                    }
                } else if (message.type === 'link') {
                    // Store new link in MongoDB
                    await linksCollection.insertOne({
                        ...message,
                        createdAt: new Date()
                    });
                }
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
