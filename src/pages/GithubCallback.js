import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config';

function GithubCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function handleCallback() {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get('code');

            if (code) {
                try {
                    // Exchange code for access token
                    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            client_id: config.github.clientId,
                            client_secret: config.github.clientSecret,
                            code: code,
                            redirect_uri: config.github.redirectUri
                        })
                    }).then(res => res.json());

                    if (tokenResponse.access_token) {
                        // Get user info
                        const userInfo = await fetch('https://api.github.com/user', {
                            headers: {
                                'Authorization': `Bearer ${tokenResponse.access_token}`,
                                'Accept': 'application/json'
                            }
                        }).then(res => res.json());

                        // Store user info in localStorage
                        localStorage.setItem('chatUsername', userInfo.login);
                        localStorage.setItem('userProfile', JSON.stringify({
                            name: userInfo.login,
                            picture: userInfo.avatar_url
                        }));

                        // Redirect back to chat
                        navigate('/discordclone');
                    } else {
                        console.error('Failed to get access token:', tokenResponse);
                        navigate('/discordclone');
                    }
                } catch (error) {
                    console.error('Error during GitHub authentication:', error);
                    navigate('/discordclone');
                }
            } else {
                navigate('/discordclone');
            }
        }

        handleCallback();
    }, [location, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            Processing GitHub login...
        </div>
    );
}

export default GithubCallback;