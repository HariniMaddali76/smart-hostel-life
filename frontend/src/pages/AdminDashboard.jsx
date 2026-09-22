import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [messMenus, setMessMenus] = useState([]);

    const [formData, setFormData] = useState({
        roomNumber: "",
        block: "",
        floor: "",
        capacity: ""
    });

    const [assignmentData, setAssignmentData] = useState({
        studentId: "",
        roomId: ""
    });

    const [messFormData, setMessFormData] = useState({
        day: "",
        meal: "",
        menu: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch rooms
    const fetchRooms = async () => {
        try {
            const response = await api.get("/rooms");
            setRooms(response.data);
        } catch (error) {
            setError("Failed to fetch rooms");
        }
    };

    // Fetch students
    const fetchStudents = async () => {
        try {
            const response = await api.get("/users/students");
            setStudents(response.data);
        } catch (error) {
            setError("Failed to fetch students");
        }
    };

    // Fetch complaints
    const fetchComplaints = async () => {
        try {
            const response = await api.get("/complaints");

            console.log("ADMIN COMPLAINTS:", response.data);

            setComplaints(response.data);
        } catch (error) {
            console.error("COMPLAINT FETCH ERROR:", error);
            setError("Failed to fetch complaints");
        }
    };

    // Fetch mess menus
    const fetchMessMenus = async () => {
        try {
            const response = await api.get("/mess");
            setMessMenus(response.data);
        } catch (error) {
            setError("Failed to fetch mess menus");
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchStudents();
        fetchMessMenus();

        fetchComplaints();

        const complaintInterval = setInterval(() => {
            fetchComplaints();
        }, 3000);

        return () => {
            clearInterval(complaintInterval);
        };
    }, []);

    // Room form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Assignment form changes
    const handleAssignmentChange = (e) => {
        setAssignmentData({
            ...assignmentData,
            [e.target.name]: e.target.value
        });
    };

    // Mess form changes
    const handleMessChange = (e) => {
        setMessFormData({
            ...messFormData,
            [e.target.name]: e.target.value
        });
    };

    // Create room
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/rooms", {
                roomNumber: formData.roomNumber,
                block: formData.block,
                floor: Number(formData.floor),
                capacity: Number(formData.capacity)
            });

            setMessage("Room created successfully!");

            setFormData({
                roomNumber: "",
                block: "",
                floor: "",
                capacity: ""
            });

            fetchRooms();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create room"
            );
        }
    };

    // Assign student to room
    const handleAssignRoom = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!assignmentData.studentId || !assignmentData.roomId) {
            setError("Please select both student and room");
            return;
        }

        try {
            await api.post("/rooms/assign", assignmentData);

            setMessage("Student assigned to room successfully!");

            setAssignmentData({
                studentId: "",
                roomId: ""
            });

            fetchStudents();
            fetchRooms();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to assign student"
            );
        }
    };

    // Update complaint status
    const handleComplaintStatus = async (complaintId, status) => {
        try {
            await api.put(
                `/complaints/${complaintId}/status`,
                { status }
            );

            setMessage("Complaint status updated successfully!");

            fetchComplaints();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update complaint status"
            );
        }
    };

    // Add Mess Menu
    const handleMessSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await api.post("/mess", messFormData);

            setMessage("Mess menu added successfully!");

            setMessFormData({
                day: "",
                meal: "",
                menu: ""
            });

            fetchMessMenus();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add mess menu"
            );
        }
    };

    // Delete Mess Menu
    const handleDeleteMess = async (id) => {
        setMessage("");
        setError("");

        try {
            await api.delete(`/mess/${id}`);

            setMessage("Mess menu deleted successfully!");

            fetchMessMenus();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete mess menu"
            );
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    return (
        <div className="admin-dashboard">

            <div className="admin-header">
                <div>
                    <h1>🏠 Admin / Warden Dashboard</h1>
                    <p>Welcome, <strong>{user?.name}</strong></p>
                    <p>{user?.email}</p>
                </div>
            </div>

            <hr />

            {/* Create Room */}

            <h2 className="admin-section-title">🏠 Create Hostel Room</h2>

            {message && (
                <p style={{ color: "green" }}>
                    {message}
                </p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Room Number</label>
                    <br />

                    <input
                        type="text"
                        name="roomNumber"
                        placeholder="Example: A101"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Block</label>
                    <br />

                    <input
                        type="text"
                        name="block"
                        placeholder="Example: A Block"
                        value={formData.block}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Floor</label>
                    <br />

                    <input
                        type="number"
                        name="floor"
                        placeholder="Example: 1"
                        value={formData.floor}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Capacity</label>
                    <br />

                    <input
                        type="number"
                        name="capacity"
                        placeholder="Example: 4"
                        min="1"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Create Room
                </button>

            </form>

            <hr />

            {/* Assign Student */}

            <h2 className="admin-section-title">👨‍🎓 Assign Student to Room</h2>

            <form onSubmit={handleAssignRoom}>

                <div>
                    <label>Student</label>
                    <br />

                    <select
                        name="studentId"
                        value={assignmentData.studentId}
                        onChange={handleAssignmentChange}
                        required
                    >
                        <option value="">
                            Select Student
                        </option>

                        {students.map((student) => (
                            <option
                                key={student._id}
                                value={student._id}
                            >
                                {student.name} - {student.email}
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Room</label>
                    <br />

                    <select
                        name="roomId"
                        value={assignmentData.roomId}
                        onChange={handleAssignmentChange}
                        required
                    >
                        <option value="">
                            Select Room
                        </option>

                        {rooms
                            .filter(
                                (room) =>
                                    room.occupiedBeds < room.capacity
                            )
                            .map((room) => (
                                <option
                                    key={room._id}
                                    value={room._id}
                                >
                                    {room.roomNumber} - {room.block}
                                    {" "}
                                    (Available:{" "}
                                    {room.capacity - room.occupiedBeds})
                                </option>
                            ))}
                    </select>
                </div>

                <br />

                <button type="submit">
                    Assign Room
                </button>

            </form>

            <hr />

            {/* Rooms */}

            <h2 className="admin-section-title">🛏️ Hostel Rooms</h2>

            {rooms.length === 0 ? (
                <p>No rooms available.</p>
            ) : (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>Room Number</th>
                            <th>Block</th>
                            <th>Floor</th>
                            <th>Capacity</th>
                            <th>Occupied</th>
                            <th>Available</th>
                            <th>Students</th>
                        </tr>
                    </thead>

                    <tbody>

                        {rooms.map((room) => (
                            <tr key={room._id}>

                                <td>{room.roomNumber}</td>

                                <td>{room.block}</td>

                                <td>{room.floor}</td>

                                <td>{room.capacity}</td>

                                <td>{room.occupiedBeds}</td>

                                <td>
                                    {room.capacity -
                                        room.occupiedBeds}
                                </td>

                                <td>
                                    {room.students?.length > 0
                                        ? room.students.map(
                                            (student) => (
                                                <div
                                                    key={student._id}
                                                >
                                                    {student.name}
                                                </div>
                                            )
                                        )
                                        : "No students"}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

            <hr />

            {/* Manage Mess Menu Section */}

            <h2 className="admin-section-title">🍴 Manage Mess Menu</h2>

            <form onSubmit={handleMessSubmit}>

                <div>
                    <label>Day</label>
                    <br />

                    <select
                        name="day"
                        value={messFormData.day}
                        onChange={handleMessChange}
                        required
                    >
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Meal</label>
                    <br />

                    <select
                        name="meal"
                        value={messFormData.meal}
                        onChange={handleMessChange}
                        required
                    >
                        <option value="">Select Meal</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Menu</label>
                    <br />

                    <input
                        type="text"
                        name="menu"
                        placeholder="Example: Idly, Sambar, Chutney"
                        value={messFormData.menu}
                        onChange={handleMessChange}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Add Mess Menu
                </button>

            </form>

            <hr />

            <h3>Current Mess Menu</h3>

            {messMenus.length === 0 ? (
                <p>No mess menu added yet.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Meal</th>
                            <th>Menu</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {messMenus.map((item) => (
                            <tr key={item._id}>
                                <td>{item.day}</td>
                                <td>{item.meal}</td>
                                <td>{item.menu}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleDeleteMess(item._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <hr />

            {/* Complaints Section */}

            <h2 className="admin-section-title">🛠️ Hostel Complaints</h2>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {complaints.length > 0 ? (
                        complaints.map((complaint) => (
                            <tr key={complaint._id}>
                                <td>
                                    {complaint.student?.name || "N/A"}
                                </td>

                                <td>
                                    {complaint.student?.email || "N/A"}
                                </td>

                                <td>
                                    {complaint.category}
                                </td>

                                <td>
                                    {complaint.description}
                                </td>

                                <td>
                                    {complaint.status}
                                </td>

                                <td>
                                    <select
                                        value={complaint.status}
                                        onChange={(e) =>
                                            handleComplaintStatus(
                                                complaint._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Resolved">
                                            Resolved
                                        </option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">
                                No complaints submitted.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>

        </div>
    );
}

export default AdminDashboard;