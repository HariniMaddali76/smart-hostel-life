import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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

  return (
    <div className="student-dashboard">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="brand">🏠 Smart Hostel Life</div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome */}
        <section className="welcome-section">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your hostel life from one place.</p>
        </section>

        {/* User Information */}
        <section className="user-info-card">
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

        {/* Room Details */}
        <h2 className="section-title">🛏️ My Room</h2>

        {roomError ? (
          <div className="service-card">
            <h3>No Room Assigned</h3>
            <p>{roomError}</p>
          </div>
        ) : room ? (
          <section className="user-info-card">
            <div>
              <span>Room Number</span>
              <strong>{room.roomNumber}</strong>
            </div>

            <div>
              <span>Block</span>
              <strong>{room.block}</strong>
            </div>

            <div>
              <span>Floor</span>
              <strong>{room.floor}</strong>
            </div>

            <div>
              <span>Capacity</span>
              <strong>{room.capacity}</strong>
            </div>

            <div>
              <span>Occupied Beds</span>
              <strong>{room.occupiedBeds}</strong>
            </div>

            <div>
              <span>Available Beds</span>
              <strong>{room.capacity - room.occupiedBeds}</strong>
            </div>
          </section>
        ) : (
          <div className="service-card">
            <p>Loading room details...</p>
          </div>
        )}

        {/* Roommates */}
        {room && (
          <>
            <h2 className="section-title">👥 My Roommates</h2>

            <section className="services-grid">
              {room.students
                ?.filter((student) => student._id !== user.id)
                .map((student) => (
                  <div className="service-card" key={student._id}>
                    <div className="service-icon">👤</div>
                    <h3>{student.name}</h3>
                    <p>{student.email}</p>
                  </div>
                ))}
            </section>
          </>
        )}

        {/* Hostel Services */}
        <h2 className="section-title">Hostel Services</h2>

        <section className="services-grid">
          <div
            className="service-card"
            onClick={() => navigate("/complaints")}
            style={{ cursor: "pointer" }}
          >
            <div className="service-icon">🛠️</div>
            <h3>Complaints</h3>
            <p>Raise and track your hostel complaints.</p>
          </div>

          <div
            className="service-card"
            onClick={() => navigate("/mess-menu")}
            style={{ cursor: "pointer" }}>
            <div className="service-icon">🍴</div>
            <h3>Mess Menu</h3>
            <p>Check the daily hostel mess menu.</p></div>

          <div
            className="service-card"
            onClick={() => navigate("/complaints")}
            style={{ cursor: "pointer" }}
          >
            <div className="service-icon">📋</div>
            <h3>My Complaints</h3>
            <p>Track the status of your submitted complaints.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;