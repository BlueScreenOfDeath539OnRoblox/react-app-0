import { useState } from 'react';
import './Glassmorphism.css';

function Glassmorphism() {

    return (
        <div className="App">
            <div className="bg">
                <div className="glassmorphism-container">
                    <h1>Glassmorphism Effect</h1>
                    <p>This is a simple example of a glassmorphism effect using CSS.</p>
                    <p>Adjust the styles in <code>Glassmorphism.css</code> to see different effects.</p>
                    <p>Enjoy the frosted glass effect!</p>
                    <div className="card-container">
                        <div className='glass-card'>
                            <h2>Glass Card</h2>
                            <p>This card has a glassmorphism effect applied to it.</p>
                            <input type="text" placeholder="Type something..." />
                            <div className="img-container">
                                <svg className='material-svg' xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="M200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm69-80h422q-44-39-99.5-59.5T480-280q-56 0-112.5 20.5T269-200Zm211-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z" /></svg>
                            </div>
                        </div>
                        <div className='glass-card'>
                            <h2>Another Glass Card</h2>
                            <p>This is another card with the same glassmorphism effect.</p>
                            <input type="text" placeholder="Type something else..." />
                            <div className="img-container">
                                <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Glassmorphism;
