import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [activeSection, setActiveSection] = useState("dashboard");

    const [room, setRoom] = useState(null);
    const [roomError, setRoomError] = useState("");

    const fetchRoomDetails = async () => {
        try {
            const response = await api.get(
                `/users/students/${user.id}/room`
            );

            setRoom(response.data.room);
        } catch (error) {
            setRoomError(
                error.response?.data?.message ||
                "Failed to fetch room details"
            );
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchRoomDetails();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    const menuItems = [
        {
            id: "dashboard",
            icon: "🏠",
            label: "Dashboard"
        },
        {
            id: "room",
            icon: "🛏️",
            label: "My Room"
        },
        {
            id: "roommates",
            icon: "👥",
            label: "Roommates"
        },
        {
            id: "complaints",
            icon: "🛠️",
            label: "Complaints"
        },
        {
            id: "mess",
            icon: "🍴",
            label: "Mess Menu"
        },
        {
            id: "myComplaints",
            icon: "📋",
            label: "My Complaints"
        }
    ];

    return (
        <div className="student-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="student-sidebar">

                <div className="student-sidebar-brand">
                    🏠
                    <span>Smart Hostel</span>
                </div>

                <nav className="student-sidebar-menu">

                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={
                                activeSection === item.id
                                    ? "student-sidebar-item active"
                                    : "student-sidebar-item"
                            }
                            onClick={() => {
                                setActiveSection(item.id);
                            }}
                        >
                            <span className="student-sidebar-icon">
                                {item.icon}
                            </span>

                            <span>{item.label}</span>
                        </button>
                    ))}

                </nav>

                <button
                    className="student-sidebar-item student-logout-item"
                    onClick={handleLogout}
                >
                    <span className="student-sidebar-icon">
                        🚪
                    </span>

                    <span>Logout</span>
                </button>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="student-main">

                {/* TOP HEADER */}

                <header className="student-topbar">

                    <div>
                        <h1>Student Dashboard</h1>

                        <p>
                            Welcome, <strong>{user?.name}</strong>
                        </p>
                    </div>

                    <div className="student-profile">
                        👤 {user?.name}
                    </div>

                </header>


                {/* =========================
                    DASHBOARD
                ========================= */}

                {activeSection === "dashboard" && (
                    <section className="student-content-section">

                        <div className="student-welcome-card">

                            <h2>
                                Welcome, {user?.name} 👋
                            </h2>

                            <p>
                                Manage your hostel life from one place.
                            </p>

                        </div>


                        {/* USER INFORMATION */}

                        <h2 className="student-section-title">
                            👤 My Profile
                        </h2>

                        <section className="student-info-card">

                            <div>
                                <span>Name</span>
                                <strong>{user?.name}</strong>
                            </div>

                            <div>
                                <span>Email</span>
                                <strong>{user?.email}</strong>
                            </div>

                            <div>
                                <span>Role</span>
                                <strong>Student</strong>
                            </div>

                        </section>


                        {/* QUICK SERVICES */}

                        <h2 className="student-section-title">
                            Hostel Services
                        </h2>

                        <section className="student-services-grid">

                            <div
                                className="student-service-card"
                                onClick={() =>
                                    setActiveSection("room")
                                }
                            >
                                <div className="student-service-icon">
                                    🛏️
                                </div>

                                <h3>My Room</h3>

                                <p>
                                    View your hostel room details.
                                </p>
                            </div>


                            <div
                                className="student-service-card"
                                onClick={() =>
                                    setActiveSection("complaints")
                                }
                            >
                                <div className="student-service-icon">
                                    🛠️
                                </div>

                                <h3>Complaints</h3>

                                <p>
                                    Raise a new hostel complaint.
                                </p>
                            </div>


                            <div
                                className="student-service-card"
                                onClick={() =>
                                    setActiveSection("mess")
                                }
                            >
                                <div className="student-service-icon">
                                    🍴
                                </div>

                                <h3>Mess Menu</h3>

                                <p>
                                    Check the daily hostel mess menu.
                                </p>
                            </div>


                            <div
                                className="student-service-card"
                                onClick={() =>
                                    setActiveSection("myComplaints")
                                }
                            >
                                <div className="student-service-icon">
                                    📋
                                </div>

                                <h3>My Complaints</h3>

                                <p>
                                    Track your complaint status.
                                </p>
                            </div>

                        </section>

                    </section>
                )}


                {/* =========================
                    MY ROOM
                ========================= */}

                {activeSection === "room" && (
                    <section className="student-content-section">

                        <h2 className="student-section-title">
                            🛏️ My Room
                        </h2>

                        {roomError ? (
                            <div className="student-service-card">
                                <h3>No Room Assigned</h3>

                                <p>
                                    {roomError}
                                </p>
                            </div>
                        ) : room ? (

                            <section className="student-info-card">

                                <div>
                                    <span>Room Number</span>
                                    <strong>
                                        {room.roomNumber}
                                    </strong>
                                </div>

                                <div>
                                    <span>Block</span>
                                    <strong>
                                        {room.block}
                                    </strong>
                                </div>

                                <div>
                                    <span>Floor</span>
                                    <strong>
                                        {room.floor}
                                    </strong>
                                </div>

                                <div>
                                    <span>Capacity</span>
                                    <strong>
                                        {room.capacity}
                                    </strong>
                                </div>

                                <div>
                                    <span>Occupied Beds</span>
                                    <strong>
                                        {room.occupiedBeds}
                                    </strong>
                                </div>

                                <div>
                                    <span>Available Beds</span>
                                    <strong>
                                        {room.capacity -
                                            room.occupiedBeds}
                                    </strong>
                                </div>

                            </section>

                        ) : (

                            <div className="student-service-card">
                                <p>
                                    Loading room details...
                                </p>
                            </div>

                        )}

                    </section>
                )}


                {/* =========================
                    ROOMMATES
                ========================= */}

                {activeSection === "roommates" && (
                    <section className="student-content-section">

                        <h2 className="student-section-title">
                            👥 My Roommates
                        </h2>

                        {room ? (

                            room.students?.filter(
                                (student) =>
                                    student._id !== user.id
                            ).length > 0 ? (

                                <section className="student-services-grid">

                                    {room.students
                                        ?.filter(
                                            (student) =>
                                                student._id !== user.id
                                        )
                                        .map((student) => (

                                            <div
                                                className="student-service-card"
                                                key={student._id}
                                            >

                                                <div className="student-service-icon">
                                                    👤
                                                </div>

                                                <h3>
                                                    {student.name}
                                                </h3>

                                                <p>
                                                    {student.email}
                                                </p>

                                            </div>

                                        ))}

                                </section>

                            ) : (

                                <div className="student-service-card">
                                    <h3>No Roommates</h3>
                                    <p>
                                        No other students are assigned
                                        to your room.
                                    </p>
                                </div>

                            )

                        ) : (

                            <div className="student-service-card">
                                <p>
                                    Loading roommate details...
                                </p>
                            </div>

                        )}

                    </section>
                )}


                {/* =========================
                    COMPLAINTS
                ========================= */}

                {activeSection === "complaints" && (
                    <section className="student-content-section">

                        <h2 className="student-section-title">
                            🛠️ Complaints
                        </h2>

                        <div className="student-service-card">

                            <h3>
                                Raise a Hostel Complaint
                            </h3>

                            <p>
                                Submit a complaint about your room,
                                maintenance, electricity, water or mess.
                            </p>

                            <button
                                className="student-action-btn"
                                onClick={() =>
                                    navigate("/complaints")
                                }
                            >
                                Open Complaints
                            </button>

                        </div>

                    </section>
                )}


                {/* =========================
                    MESS MENU
                ========================= */}

                {activeSection === "mess" && (
                    <section className="student-content-section">

                        <h2 className="student-section-title">
                            🍴 Mess Menu
                        </h2>

                        <div className="student-service-card">

                            <h3>
                                Hostel Mess Menu
                            </h3>

                            <p>
                                View today's and upcoming hostel
                                mess menu.
                            </p>

                            <button
                                className="student-action-btn"
                                onClick={() =>
                                    navigate("/mess-menu")
                                }
                            >
                                Open Mess Menu
                            </button>

                        </div>

                    </section>
                )}


                {/* =========================
                    MY COMPLAINTS
                ========================= */}

                {activeSection === "myComplaints" && (
                    <section className="student-content-section">

                        <h2 className="student-section-title">
                            📋 My Complaints
                        </h2>

                        <div className="student-service-card">

                            <h3>
                                Track Your Complaints
                            </h3>

                            <p>
                                View the complaints you submitted
                                and track their current status.
                            </p>

                            <button
                                className="student-action-btn"
                                onClick={() =>
                                    navigate("/complaints")
                                }
                            >
                                View My Complaints
                            </button>

                        </div>

                    </section>
                )}

            </main>

        </div>
    );
}

export default StudentDashboard;