import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";

function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-container">

            <div className="role-card">

                <div className="role-icon">
                    🏠
                </div>

                <h1>Smart Hostel Life</h1>

                <p className="role-subtitle">
                    Welcome! Please select your role to continue.
                </p>

                <div className="role-options">

                    <button
                        className="role-btn student-btn"
                        onClick={() => navigate("/student-login")}
                    >
                        <span>👨‍🎓</span>
                        <div>
                            <strong>Student</strong>
                            <small>Access your hostel services</small>
                        </div>
                    </button>

                    <button
                        className="role-btn admin-btn"
                        onClick={() => navigate("/admin-login")}
                    >
                        <span>👨‍💼</span>
                        <div>
                            <strong>Admin / Warden</strong>
                            <small>Manage hostel operations</small>
                        </div>
                    </button>

                </div>

            </div>

        </div>
    );
}

export default RoleSelection;