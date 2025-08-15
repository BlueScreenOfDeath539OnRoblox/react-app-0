const { MongoClient } = require('mongodb');

// Replace this with your MongoDB connection string from Atlas
const uri = "mongodb+srv://IAmMyGuy21th:12200906#Nh@reactappdata.j9bg76f.mongodb.net/?retryWrites=true&w=majority&appName=ReactAppData";
const dbName = 'linksDB';

let client;
let db;

async function connectToDb() {
    if (db) return db;

    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');

        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function getLinksCollection() {
    const db = await connectToDb();
    return db.collection('links');
}

async function closeConnection() {
    if (client) {
        await client.close();
        db = null;
        console.log('Disconnected from MongoDB');
    }
}

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit();
});

module.exports = {
    connectToDb,
    getLinksCollection,
    closeConnection
};
