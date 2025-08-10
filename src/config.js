const config = {
    // Development WebSocket URL (local testing)
    development: 'ws://localhost:3001',

    // Production WebSocket URL (using Render.com URL)
    production: 'wss://discord-clone-websocket.onrender.com',

    // Get the appropriate WebSocket URL based on environment
    get websocketUrl() {
        if (window.location.hostname === 'localhost') {
            return this.development;
        }
        return this.production;
    }
};

export default config;
