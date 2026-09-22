import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminRegister() {
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
                role: "admin"
            });

            setSuccess(
                "Admin registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/admin-login");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Admin registration failed."
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>Admin Registration</h1>

                <p className="auth-subtitle">
                    Register as Hostel Admin / Warden
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
                        placeholder="Enter admin name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

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
                        placeholder="Create admin password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Register as Admin
                    </button>

                </form>

                <p className="auth-link">
                    Already registered?{" "}
                    <Link to="/admin-login">
                        Admin Login
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default AdminRegister;