import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Profile from "./pages/Profile";


import { useAuth } from "./context/AuthContext";

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="page-message">Loading...</div>;
    }

    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Feed />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" replace /> : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        user ? (
                            <Navigate to="/" replace />
                        ) : (
                            <Register />
                        )
                    }
                />

                <Route
    path="/users"
    element={
        <ProtectedRoute>
            <Users />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile/:userId"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </>
    );
}

export default App;