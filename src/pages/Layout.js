import { Outlet, Link } from "react-router-dom";
import "./Layout.css"; // Import the CSS file

const Layout = () => {
    return (
        <>
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
                        <Link to="/symbols">Symbols Test</Link>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;