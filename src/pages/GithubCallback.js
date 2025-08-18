import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GithubCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
            // Send message to parent window with the authorization code
            window.opener.postMessage({
                type: 'github-oauth-success',
                code: code
            }, window.location.origin);

            // Close this window/tab
            window.close();
        } else {
            // If no code is present, redirect back to the chat
            navigate('/discordclone');
        }
    }, [location, navigate]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            Processing GitHub login...
        </div>
    );
}

export default GithubCallback;
