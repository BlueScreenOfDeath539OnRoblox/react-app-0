import { useState } from 'react';
import './App.css';

function Tests() {
    const [showVids, setShowVids] = useState(true); // State to manage video visibility

    return (
        <div className="App">
            <h1>Tests Page</h1>
            <p>This page is for testing purposes.</p>
            <div className="inlinecontainer">
                <button className='iconbutton' onClick={() => alert('This is a test button!')}>
                    <svg width="50px" height="50px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" fill="white" fill-opacity="0" />
                        <path d="M5.32497 43.4998L13.81 43.5L44.9227 12.3873L36.4374 3.90204L5.32471 35.0147L5.32497 43.4998Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                        <path d="M27.9521 12.3873L36.4374 20.8726" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p>
                        Click Me
                    </p>
                </button>
            </div>
            <div className='inlinecontainer'>
                <button className='iconbutton' onClick={() => setShowVids(!showVids)}>
                    <svg width="50px" height="50px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                        <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                        <path d="M4 10C4 8.89543 4.89543 8 6 8H42C43.1046 8 44 8.89543 44 10V38C44 39.1046 43.1046 40 42 40H6C4.89543 40 4 39.1046 4 38V10Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                        <path d="M36 8V40" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12 8V40" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M38 18H44" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M38 30H44" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 18H10" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 16V20" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9 8H15" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9 40H15" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33 8H39" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33 40H39" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 30H10" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 28V32" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M44 28V32" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M44 16V20" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M21 19L29 24L21 29V19Z" fill="#43CCF8" stroke="white" stroke-width="4" stroke-linejoin="round" />
                    </svg>
                    <p>
                        Toggle Videos
                    </p>
                </button>
            </div>
            {showVids && (
                <div className='video-container'>
                    <p>Feel free to explore and test features here!</p>
                    <p>Minecraft Live 2020 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/iN2ERVo90QM" title="Minecraft Live: Announcement Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <p>Minecraft Live 2021 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/5qrUb7a821c" title="Minecraft Live 2021: Announcement Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <p>Minecraft Live 2022 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/jMe3tdyjouM" title="Minecraft Live 2022: Announcement Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <p>Minecraft Live 2023 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/zLON6wZYgsE" title="Minecraft Live is back for 2023!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <p>Minecraft Live 2024 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/Xgr9bVmCPHo" title="Minecraft Live 2024: A MINECRAFT MOVIE | EXCLUSIVE INSIGHT" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <p>Minecraft Live 2025 Trailer:</p>
                    <iframe width="384" height="216" src="https://www.youtube.com/embed/1lWDHaqw-B4" title="Minecraft Live 2025: Announcement Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    <br />
                </div>
            )}
        </div>
    );
}
export default Tests;
