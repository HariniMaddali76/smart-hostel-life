import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

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

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            if (response.data.user.role !== "admin") {
                setError("Access denied. Admin account required.");
                return;
            }

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/admin");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Admin login failed."
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Admin Login</h1>

                <p className="auth-subtitle">
                    Hostel Admin / Warden
                </p>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter admin email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter admin password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Admin Login
                    </button>

                </form>

                <p
                    className="auth-link"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                >
                    ← Back to role selection
                </p>

                <p className="auth-link">
                    Don't have an admin account?{" "}
                    <Link to="/admin-register">
                        Register as Admin
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default AdminLogin;