import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Test2() {
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup function for when component unmounts
        return () => {
            // Remove inspector if it exists
            const inspector = document.querySelector('.a-inspector-wrapper');
            if (inspector) {
                inspector.remove();
            }

            // Remove any leftover buttons
            const buttons = document.querySelectorAll('.a-enter-vr, .a-enter-ar');
            buttons.forEach(button => button.remove());
        };
    }, []);

    // Handle inspector opening
    const handleKeyPress = (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'i') {
            // Store current URL to prevent navigation while inspector is open
            const currentPath = window.location.pathname;

            // Watch for navigation attempts
            const navigationWatcher = setInterval(() => {
                if (window.location.pathname !== currentPath) {
                    // Force close inspector before allowing navigation
                    const inspector = document.querySelector('.a-inspector-wrapper');
                    if (inspector) {
                        inspector.remove();
                        navigate(window.location.pathname);
                    }
                    clearInterval(navigationWatcher);
                }
            }, 100);
        }
    };

    useEffect(() => {
        // Add keypress listener
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            // Remove keypress listener on cleanup
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [navigate]);

    return (
        <div onKeyDown={handleKeyPress}>
            <h1>Press <span className='keyshortcutindicator'>Ctrl + Alt + I</span> to open A-Frame editor.</h1>
            <div className="App">
                <a-scene
                    embedded
                    background="color: #555"
                    keyboard-shortcuts="enabled: false"
                    screenshot="enabled: false"
                    vr-mode-ui="enabled: false"
                    device-orientation-permission-ui="enabled: false"
                    fog="color: #555; density: 1"
                >
                    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9" shadow=""></a-box>
                    <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D" shadow="" material="color: #8f5d00"></a-cylinder>
                    <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" color="#7BC8A4" shadow="" material="flatShading: true;" geometry="segmentsHeight: 20; segmentsWidth: 20" scale="30 30 30"></a-plane>
                    <a-entity geometry="primitive: cone" scale="1.492 4.1952 1.492" position="1.11578 3.41638 -3.05773" material="flatShading: true; color: #137c24; roughness: 0.55"></a-entity>
                    <a-entity text__testingtext="align: center; anchor: align; side: double; tabSize: 1; value: This is Some Text!; width: 11.8" position="-1.5762 3.02468 0"></a-entity>
                </a-scene>
            </div>
        </div>
    );
}

export default Test2;