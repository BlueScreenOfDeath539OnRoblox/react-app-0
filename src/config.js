const config = {
    // Development WebSocket URL (local testing)
    development: 'ws://localhost:3001',

    // Production WebSocket URL (using Render.com URL)
    production: 'ws://discord-clone-websocket.onrender.com',  // Changed from wss to ws

    // Get the appropriate WebSocket URL based on environment
    get websocketUrl() {
        const url = window.location.hostname === 'localhost' ? this.development : this.production;
        console.log('Using WebSocket URL:', url);
        return url;
    }
};

export default config;
