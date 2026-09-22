import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if (role && user.role !== role) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        return <Navigate to="/student" replace />;
    }

    return children;
}

export default ProtectedRoute;