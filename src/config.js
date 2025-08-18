const config = {
    // Development WebSocket URL (local testing)
    development: 'ws://localhost:3001',

    // Production WebSocket URL (using Render.com URL)
    production: 'wss://discord-clone-websocket.onrender.com/ws',  // Using secure WebSocket with specific path

    // GitHub OAuth Configuration
    github: {
        clientId: 'Ov23livF5gipe3gyMxCI',
        clientSecret: '22de9998a8e5803adbece665464486c8b68cab75',
        redirectUri: 'http://localhost:3000/react-app-0/auth/github/callback',
        authorizationUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token'
    },

    // Get the appropriate WebSocket URL based on environment
    websocketUrl() {
        const url = window.location.hostname === 'localhost' ? this.development : this.production;
        console.log('Using WebSocket URL:', url);
        return url;
    },

    // Get the GitHub OAuth URL with required parameters
    githubAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.github.clientId,
            redirect_uri: this.github.redirectUri,
            scope: 'read:user',
            state: Math.random().toString(36).substring(7)
        });
        return `${this.github.authorizationUrl}?${params}`;
    }
};

export default config;
