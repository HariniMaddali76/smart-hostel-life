import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            await api.post("/auth/register", {
                ...formData,
                role: "student"
            });

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Register as a hostel student
                </p>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p className="auth-link">
                    Already have an account?{" "}
                    <Link to="/">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;