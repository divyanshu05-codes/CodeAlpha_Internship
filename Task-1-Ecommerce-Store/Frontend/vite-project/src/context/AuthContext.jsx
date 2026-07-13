import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const response = await api.get("/auth/get-me");
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkLoggedInUser();
    }, []);

    const register = async (formData) => {
        const response = await api.post("/auth/register", formData);

        setUser(response.data.user);

        return response.data;
    };

    const login = async (formData) => {
        const response = await api.post("/auth/login", formData);

        setUser(response.data.user);

        return response.data;
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                authLoading,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}