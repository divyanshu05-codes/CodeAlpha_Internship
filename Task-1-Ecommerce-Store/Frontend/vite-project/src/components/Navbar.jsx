import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const {
        user,
        authLoading,
        logout,
    } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                ShopNest
            </Link>

            <div className="nav-links">
                <Link to="/">
                    Products
                </Link>

                <Link to="/cart">
    Cart ({cartCount})
</Link>

                {!authLoading && !user && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </Link>
                    </>
                )}

                {!authLoading && user && (
                    <>
                        <span className="user-name">
                            Hi, {user.name}
                        </span>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;