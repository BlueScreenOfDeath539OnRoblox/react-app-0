const config = {
    // Development WebSocket URL (local testing)
    development: 'ws://localhost:3001',

    // Production WebSocket URL (using Render.com URL)
    production: 'wss://discord-clone-websocket.onrender.com/ws',  // Using secure WebSocket with specific path

    // Get the appropriate WebSocket URL based on environment
    get websocketUrl() {
        const url = window.location.hostname === 'localhost' ? this.development : this.production;
        console.log('Using WebSocket URL:', url);
        return url;
    }
};

export default config;
