import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegister from "./pages/AdminRegister";
import Complaints from "./pages/Complaints";
import ProtectedRoute from "./components/ProtectedRoute";
import MessMenu from "./pages/MessMenu";
import ExperimentWorkspace from "./pages/ExperimentWorkspace";
import Personas from "./pages/Personas";
import Interview from "./pages/Interview";
import SurveyMode from "./pages/SurveyMode";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Role Selection */}
                <Route
                    path="/"
                    element={<RoleSelection />}
                />

                {/* Student Login */}
                <Route
                    path="/student-login"
                    element={<Login />}
                />

                {/* Student Registration */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Student Dashboard */}
                <Route
    path="/student"
    element={
        <ProtectedRoute role="student">
            <StudentDashboard />
        </ProtectedRoute>
    }
/>

                {/* Admin Dashboard */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
    />
                <Route
                path="/admin-register"
                element={<AdminRegister />}
            />
            <Route
                path="/complaints"
                element={<Complaints />}
            />
            
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/mess-menu" element={<MessMenu />} />
            <Route
                 path="/mess-menu"
               element={<MessMenu />}
/>
              <Route
    path="/workspace"
    element={<ExperimentWorkspace />}
/>
<Route
    path="/personas"
    element={<Personas />}
/>
<Route path="/interview/:personaId" element={<Interview />} />
<Route path="/survey" element={<SurveyMode />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;
