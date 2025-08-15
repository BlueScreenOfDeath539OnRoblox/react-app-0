const WebSocket = require('ws');
const { getLinksCollection } = require('./db');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws) => {
        console.log('Client connected');

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data);

                if (message.header === 'LINKS') {
                    const linksCollection = await getLinksCollection();

                    if (message.type === 'link') {
                        // Store new link in MongoDB
                        await linksCollection.insertOne({
                            ...message,
                            createdAt: new Date()
                        });

                        // Broadcast to all clients
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(message));
                            }
                        });
                    } else if (message.type === 'request_links') {
                        // Fetch all links from MongoDB
                        const links = await linksCollection.find({})
                            .sort({ createdAt: -1 })
                            .toArray();

                        ws.send(JSON.stringify({
                            header: 'LINKS',
                            type: 'links_list',
                            links: links
                        }));
                    }
                } else if (message.header === 'CHAT') {
                    // Handle chat messages (existing logic)
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(data);
                        }
                    });
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
}

module.exports = setupWebSocket;
