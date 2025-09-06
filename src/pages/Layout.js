import { Outlet, Link } from "react-router-dom";
import "./Layout.css"; // Import the CSS file

const Layout = () => {
    return (
        <>
            <div className="layout-container">
                <div className="hover-box"></div>
                <nav className="main-navbar">
                    <ul className="main-navbar-list">
                        <li>
                            <Link to="/">App</Link>
                        </li>
                        <li>
                            <Link to="/other">Other</Link>
                        </li>
                        <li>
                            <Link to="/testing">Test and Stuff</Link>
                        </li>
                        <li>
                            <Link to="/discordclone">DiscordClone example</Link>
                        </li>
                        <li>
                            <Link to="/plat0">Platformer Test</Link>
                        </li>
                        <li>
                            <Link to="/symbols">3d Testing</Link>
                        </li>
                        <li>
                            <Link to="/eagler0">Everything Eaglercraft</Link>
                        </li>
                        <li>
                            <Link to="/links">Links Collection</Link>
                        </li>
                        <li>
                            <Link to="/add-link">Add Link</Link>
                        </li>
                        <li>
                            <Link to="glassmorphism">Glassmorphism</Link>
                        </li>
                    </ul>
                </nav>

                <Outlet />
            </div>
        </>
    )
};

export default Layout;