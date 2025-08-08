import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

// Platformer Game Test Page
// This page is for testing a simple platformer game using React.

function Game() {
    const [gameState, setGameState] = useState({
        playerPos: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        isJumping: false,
        isDucking: false,
        keysPressed: new Set(),
    });

    // Physics constants as state to allow real-time adjustments
    const [physics, setPhysics] = useState({
        gravity: 0.5,
        jumpForce: 12,
        moveSpeed: 5,
        terminalVelocity: 20,
        friction: 0.8,  // New: friction coefficient (0-1)
        airControl: 0.3 // New: air control multiplier
    });

    const GROUND_Y = 0;
    const CONTAINER_WIDTH = 800;

    // Handle physics constant changes
    const handlePhysicsChange = (name, value) => {
        setPhysics(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Prevent scrolling on arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
                event.preventDefault();
            }

            setGameState(prevState => ({
                ...prevState,
                keysPressed: new Set([...prevState.keysPressed, event.key])
            }));
        };

        const handleKeyUp = (event) => {
            setGameState(prevState => {
                const newKeys = new Set([...prevState.keysPressed]);
                newKeys.delete(event.key);
                return {
                    ...prevState,
                    keysPressed: newKeys
                };
            });
        };

        // Game loop using requestAnimationFrame
        let animationFrameId;
        const gameLoop = () => {
            setGameState(prevState => {
                // Handle continuous movement
                let newVelocityX = prevState.velocity.x;
                const isOnGround = prevState.playerPos.y <= GROUND_Y;

                // Apply movement forces
                if (prevState.keysPressed.has('ArrowLeft')) {
                    // Apply force based on air/ground state
                    const controlMultiplier = isOnGround ? 1 : physics.airControl;
                    newVelocityX -= physics.moveSpeed * controlMultiplier;
                } else if (prevState.keysPressed.has('ArrowRight')) {
                    const controlMultiplier = isOnGround ? 1 : physics.airControl;
                    newVelocityX += physics.moveSpeed * controlMultiplier;
                }

                // Apply friction
                if (isOnGround) {
                    newVelocityX *= physics.friction;
                }

                // Limit horizontal speed
                newVelocityX = Math.max(-physics.moveSpeed * 1.5, Math.min(physics.moveSpeed * 1.5, newVelocityX));

                // Handle jumping
                let newVelocityY = prevState.velocity.y;
                if (prevState.keysPressed.has('ArrowUp') && !prevState.isJumping) {
                    newVelocityY = physics.jumpForce;
                }

                // Apply gravity
                newVelocityY = Math.max(
                    -physics.terminalVelocity,
                    newVelocityY - physics.gravity
                );

                // Calculate new position
                let newX = prevState.playerPos.x + newVelocityX;
                let newY = prevState.playerPos.y + newVelocityY;

                // Wall collision
                if (newX <= 0 || newX >= CONTAINER_WIDTH - 50) {
                    newVelocityX *= -0.5; // Bounce off walls with reduced velocity
                    newX = Math.max(0, Math.min(CONTAINER_WIDTH - 50, newX));
                }

                // Floor collision
                if (newY <= GROUND_Y) {
                    newY = GROUND_Y;
                    newVelocityY = 0;
                }

                return {
                    ...prevState,
                    playerPos: { x: newX, y: newY },
                    velocity: { x: newVelocityX, y: newVelocityY },
                    isJumping: newY > GROUND_Y,
                    isDucking: prevState.keysPressed.has('ArrowDown')
                };
            });

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        // Start game loop
        gameLoop();

        // Add event listeners
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // Cleanup
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(animationFrameId);
        };
    }, [physics]);  // Add physics as dependency since we use it in the game loop

    return (
        <div className="App">
            <h1>Game Page</h1>
            <p>Testing a platformer game with React.</p>
            <div className="game-container">
                <div className="player" style={{
                    left: `${gameState.playerPos.x}px`,
                    bottom: `${gameState.playerPos.y}px`,
                    transform: (() => {
                        const xVel = -gameState.velocity.x;
                        const yVel = gameState.velocity.y;
                        const speed = Math.sqrt(xVel * xVel + yVel * yVel);
                        const isOnGround = gameState.playerPos.y <= GROUND_Y;

                        const stretch = 1 + (Math.min(speed, 15) / 30);
                        const squish = 1 / stretch;

                        if (gameState.isDucking) {
                            return `scale(1.4, 0.5) translateY(10px)`;
                        }

                        // If moving significantly and in the air
                        if (speed > 0.1 && !isOnGround) {
                            const rotation = Math.atan2(yVel, xVel) * (180 / Math.PI);
                            return `rotate(${rotation}deg) scale(${stretch}, ${squish})`;
                        }

                        // On ground or not moving, just apply stretch/squish
                        if (speed > 0.1) {
                            return `scale(${stretch}, ${squish})`;
                        }

                        return 'scale(1, 1)';
                    })(),
                    height: '50px',
                    transformOrigin: gameState.playerPos.y <= GROUND_Y ? 'center bottom' : 'center center',
                    //transition: 'transform 0.05s ease-out'
                }}>
                </div>
            </div>
            <div className="physics-controls">
                <h3>Physics Controls</h3>
                <div className="control-group">
                    <label>
                        Gravity ({physics.gravity})
                        <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={physics.gravity}
                            onChange={(e) => handlePhysicsChange('gravity', e.target.value)}
                        />
                    </label>
                </div>
                <div className="control-group">
                    <label>
                        Jump Force ({physics.jumpForce})
                        <input
                            type="range"
                            min="5"
                            max="20"
                            step="0.5"
                            value={physics.jumpForce}
                            onChange={(e) => handlePhysicsChange('jumpForce', e.target.value)}
                        />
                    </label>
                </div>
                <div className="control-group">
                    <label>
                        Move Speed ({physics.moveSpeed})
                        <input
                            type="range"
                            min="1"
                            max="15"
                            step="0.5"
                            value={physics.moveSpeed}
                            onChange={(e) => handlePhysicsChange('moveSpeed', e.target.value)}
                        />
                    </label>
                </div>
                <div className="control-group">
                    <label>
                        Terminal Velocity ({physics.terminalVelocity})
                        <input
                            type="range"
                            min="10"
                            max="40"
                            step="1"
                            value={physics.terminalVelocity}
                            onChange={(e) => handlePhysicsChange('terminalVelocity', e.target.value)}
                        />
                    </label>
                </div>
                <div className="control-group">
                    <label>
                        Friction ({physics.friction})
                        <input
                            type="range"
                            min="0.5"
                            max="0.99"
                            step="0.01"
                            value={physics.friction}
                            onChange={(e) => handlePhysicsChange('friction', e.target.value)}
                        />
                    </label>
                </div>
                <div className="control-group">
                    <label>
                        Air Control ({physics.airControl})
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={physics.airControl}
                            onChange={(e) => handlePhysicsChange('airControl', e.target.value)}
                        />
                    </label>
                </div>
            </div>
            <div className="controls">
                <p>Use arrow keys to control the player:</p>
                <ul>
                    <li>Up Arrow: Jump</li>
                    <li>Down Arrow: Duck</li>
                    <li>Left Arrow: Move Left</li>
                    <li>Right Arrow: Move Right</li>
                </ul>
            </div>
            <style jsx>{`
                .game-container {
                    position: relative;
                    width: ${CONTAINER_WIDTH}px;
                    height: 400px;
                    background-color: #f0f0f0;
                    border: 2px solid #000;
                    margin: 0 auto;
                    overflow: hidden;
                }
                .player {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    background-color: #ffcc00;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    will-change: transform;
                }
                .physics-controls {
                    max-width: ${CONTAINER_WIDTH}px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ff8c00;
                    border-radius: 8px;
                    color: white;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .control-group {
                    margin: 10px 0;
                }
                .control-group label {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    font-weight: bold;
                }
                .control-group input {
                    width: 100%;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .control-group input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

export default Game;