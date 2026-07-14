import { NavLink, Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const getNavClass = ({ isActive }) =>
        isActive
            ? "nav-button active-nav-button"
            : "nav-button";

    return (
        <header className="navbar-wrapper">
            <nav className="navbar">

                <Link
                    to={user ? "/feed" : "/login"}
                    className="navbar-brand"
                >
                    <span className="brand-logo">
                        C
                    </span>

                    <span className="brand-name">
                        ConnectHub
                    </span>
                </Link>

                <div className="navbar-links">

                    {user ? (
                        <>
                            <NavLink
                                to="/feed"
                                className={getNavClass}
                            >
                                <span className="nav-icon">
                                    ⌂
                                </span>

                                Feed
                            </NavLink>

                            <NavLink
                                to="/users"
                                className={getNavClass}
                            >
                                <span className="nav-icon">
                                    ♙
                                </span>

                                Users
                            </NavLink>

                            <NavLink
                                to="/profile"
                                className={getNavClass}
                            >
                                <span className="nav-icon">
                                    ◉
                                </span>

                                Profile
                            </NavLink>

                            <button
                                type="button"
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                <span>↪</span>

                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={getNavClass}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={getNavClass}
                            >
                                Register
                            </NavLink>
                        </>
                    )}

                </div>

            </nav>
        </header>
    );
}

export default Navbar;