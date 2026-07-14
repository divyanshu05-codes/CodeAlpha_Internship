import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            await register(formData);

            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Registration failed"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <form
                className="auth-card"
                onSubmit={handleSubmit}
            >
                <h1>Create Account</h1>

                {error && (
                    <p className="error-message">{error}</p>
                )}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                />

                <button type="submit" disabled={submitting}>
                    {submitting
                        ? "Creating Account..."
                        : "Register"}
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </form>
        </main>
    );
}

export default Register;