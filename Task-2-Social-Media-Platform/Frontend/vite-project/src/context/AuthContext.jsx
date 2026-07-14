import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {
        try {
            const response = await api.get("/auth/get-me");

            setUser(response.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const register = async (formData) => {
        const response = await api.post(
            "/auth/register",
            formData
        );

        setUser(response.data.user);

        return response.data;
    };

    const login = async (formData) => {
        const response = await api.post(
            "/auth/login",
            formData
        );

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
                loading,
                register,
                login,
                logout,
                getCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);