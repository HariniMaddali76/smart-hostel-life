// import { useEffect, useState } from "react";
// import api from "../services/api";
// import "./AdminDashboard.css";

// function AdminDashboard() {
//     const user = JSON.parse(localStorage.getItem("user"));

//     const [activeSection, setActiveSection] = useState("dashboard");

//     const [rooms, setRooms] = useState([]);
//     const [students, setStudents] = useState([]);
//     const [complaints, setComplaints] = useState([]);
//     const [messMenus, setMessMenus] = useState([]);

//     const [aiInsights, setAiInsights] = useState(null);
//     const [aiLoading, setAiLoading] = useState(false);
//     const [aiError, setAiError] = useState("");

//     const [formData, setFormData] = useState({
//         roomNumber: "",
//         block: "",
//         floor: "",
//         capacity: ""
//     });

//     const [assignmentData, setAssignmentData] = useState({
//         studentId: "",
//         roomId: ""
//     });

//     const [messFormData, setMessFormData] = useState({
//         day: "",
//         meal: "",
//         menu: ""
//     });

//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     // =========================
//     // FETCH DATA
//     // =========================

//     const fetchRooms = async () => {
//         try {
//             const response = await api.get("/rooms");
//             setRooms(response.data);
//         } catch (error) {
//             setError("Failed to fetch rooms");
//         }
//     };

//     const fetchStudents = async () => {
//         try {
//             const response = await api.get("/users/students");
//             setStudents(response.data);
//         } catch (error) {
//             setError("Failed to fetch students");
//         }
//     };

//     const fetchComplaints = async () => {
//         try {
//             const response = await api.get("/complaints");
//             setComplaints(response.data);
//         } catch (error) {
//             console.error("COMPLAINT FETCH ERROR:", error);
//             setError("Failed to fetch complaints");
//         }
//     };

//     const fetchMessMenus = async () => {
//         try {
//             const response = await api.get("/mess");
//             setMessMenus(response.data);
//         } catch (error) {
//             setError("Failed to fetch mess menus");
//         }
//     };

//     // =========================
//     // INITIAL LOAD
//     // =========================

//     useEffect(() => {
//         fetchRooms();
//         fetchStudents();
//         fetchComplaints();
//         fetchMessMenus();

//         const complaintInterval = setInterval(() => {
//             fetchComplaints();
//         }, 3000);

//         return () => {
//             clearInterval(complaintInterval);
//         };
//     }, []);

//     // =========================
//     // AI INSIGHTS
//     // =========================

//     const fetchAIInsights = async () => {
//         try {
//             setAiLoading(true);
//             setAiError("");

//             const response = await api.get("/ai/insights");

//             setAiInsights(response.data.insights);
//         } catch (error) {
//             console.error("AI Insights Error:", error);

//             setAiError(
//                 error.response?.data?.message ||
//                 "Failed to generate AI insights"
//             );
//         } finally {
//             setAiLoading(false);
//         }
//     };

//     // =========================
//     // FORM HANDLERS
//     // =========================

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleAssignmentChange = (e) => {
//         setAssignmentData({
//             ...assignmentData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleMessChange = (e) => {
//         setMessFormData({
//             ...messFormData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // =========================
//     // CREATE ROOM
//     // =========================

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setMessage("");
//         setError("");

//         try {
//             await api.post("/rooms", {
//                 roomNumber: formData.roomNumber,
//                 block: formData.block,
//                 floor: Number(formData.floor),
//                 capacity: Number(formData.capacity)
//             });

//             setMessage("Room created successfully!");

//             setFormData({
//                 roomNumber: "",
//                 block: "",
//                 floor: "",
//                 capacity: ""
//             });

//             fetchRooms();

//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to create room"
//             );
//         }
//     };

//     // =========================
//     // ASSIGN STUDENT
//     // =========================

//     const handleAssignRoom = async (e) => {
//         e.preventDefault();

//         setMessage("");
//         setError("");

//         if (!assignmentData.studentId || !assignmentData.roomId) {
//             setError("Please select both student and room");
//             return;
//         }

//         try {
//             await api.post("/rooms/assign", assignmentData);

//             setMessage("Student assigned to room successfully!");

//             setAssignmentData({
//                 studentId: "",
//                 roomId: ""
//             });

//             fetchStudents();
//             fetchRooms();

//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to assign student"
//             );
//         }
//     };

//     // =========================
//     // COMPLAINT STATUS
//     // =========================

//     const handleComplaintStatus = async (complaintId, status) => {
//         try {
//             await api.put(
//                 `/complaints/${complaintId}/status`,
//                 { status }
//             );

//             setMessage("Complaint status updated successfully!");

//             fetchComplaints();

//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to update complaint status"
//             );
//         }
//     };

//     // =========================
//     // ADD MESS MENU
//     // =========================

//     const handleMessSubmit = async (e) => {
//         e.preventDefault();

//         setMessage("");
//         setError("");

//         try {
//             await api.post("/mess", messFormData);

//             setMessage("Mess menu added successfully!");

//             setMessFormData({
//                 day: "",
//                 meal: "",
//                 menu: ""
//             });

//             fetchMessMenus();

//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to add mess menu"
//             );
//         }
//     };

//     // =========================
//     // DELETE MESS
//     // =========================

//     const handleDeleteMess = async (id) => {
//         setMessage("");
//         setError("");

//         try {
//             await api.delete(`/mess/${id}`);

//             setMessage("Mess menu deleted successfully!");

//             fetchMessMenus();

//         } catch (error) {
//             setError(
//                 error.response?.data?.message ||
//                 "Failed to delete mess menu"
//             );
//         }
//     };

//     // =========================
//     // LOGOUT
//     // =========================

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");

//         window.location.href = "/";
//     };

//     // =========================
//     // SIDEBAR
//     // =========================

//     const menuItems = [
//         {
//             id: "dashboard",
//             icon: "🏠",
//             label: "Dashboard"
//         },
//         {
//             id: "rooms",
//             icon: "🛏️",
//             label: "Rooms"
//         },
//         {
//             id: "students",
//             icon: "👨‍🎓",
//             label: "Students"
//         },
//         {
//             id: "mess",
//             icon: "🍴",
//             label: "Mess Menu"
//         },
//         {
//             id: "ai",
//             icon: "🤖",
//             label: "AI Insights"
//         },
//         {
//             id: "complaints",
//             icon: "🛠️",
//             label: "Complaints"
//         }
//     ];

//     return (
//         <div className="admin-layout">

//             {/* =========================
//                 SIDEBAR
//             ========================= */}

//             <aside className="admin-sidebar">

//                 <div className="sidebar-brand">
//                     🏠
//                     <span>Smart Hostel</span>
//                 </div>

//                 <nav className="sidebar-menu">

//                     {menuItems.map((item) => (
//                         <button
//                             key={item.id}
//                             className={
//                                 activeSection === item.id
//                                     ? "sidebar-item active"
//                                     : "sidebar-item"
//                             }
//                             onClick={() => {
//                                 setActiveSection(item.id);
//                                 setMessage("");
//                                 setError("");
//                             }}
//                         >
//                             <span className="sidebar-icon">
//                                 {item.icon}
//                             </span>

//                             <span>{item.label}</span>
//                         </button>
//                     ))}

//                 </nav>

//                 <button
//                     className="sidebar-item logout-item"
//                     onClick={handleLogout}
//                 >
//                     <span className="sidebar-icon">🚪</span>
//                     <span>Logout</span>
//                 </button>

//             </aside>

//             {/* =========================
//                 MAIN CONTENT
//             ========================= */}

//             <main className="admin-main">

//                 {/* HEADER */}

//                 <header className="admin-topbar">

//                     <div>
//                         <h1>Admin / Warden Dashboard</h1>
//                         <p>
//                             Welcome, <strong>{user?.name}</strong>
//                         </p>
//                     </div>

//                     <div className="admin-profile">
//                         👤 {user?.name}
//                     </div>

//                 </header>

//                 {/* GLOBAL MESSAGES */}

//                 {message && (
//                     <div className="success-message">
//                         {message}
//                     </div>
//                 )}

//                 {error && (
//                     <div className="error-message">
//                         {error}
//                     </div>
//                 )}

//                 {/* =========================
//                     DASHBOARD
//                 ========================= */}

//                 {activeSection === "dashboard" && (
//                     <section className="dashboard-section">

//                         <h2>Dashboard Overview</h2>

//                         <p className="section-description">
//                             Manage hostel rooms, students, mess,
//                             complaints and AI-powered insights.
//                         </p>

//                         <div className="overview-grid">

//                             <div className="overview-card">
//                                 <div className="overview-icon">
//                                     🛏️
//                                 </div>

//                                 <div>
//                                     <h3>{rooms.length}</h3>
//                                     <p>Total Rooms</p>
//                                 </div>
//                             </div>

//                             <div className="overview-card">
//                                 <div className="overview-icon">
//                                     👨‍🎓
//                                 </div>

//                                 <div>
//                                     <h3>{students.length}</h3>
//                                     <p>Students</p>
//                                 </div>
//                             </div>

//                             <div className="overview-card">
//                                 <div className="overview-icon">
//                                     🛠️
//                                 </div>

//                                 <div>
//                                     <h3>{complaints.length}</h3>
//                                     <p>Complaints</p>
//                                 </div>
//                             </div>

//                             <div className="overview-card">
//                                 <div className="overview-icon">
//                                     🍴
//                                 </div>

//                                 <div>
//                                     <h3>{messMenus.length}</h3>
//                                     <p>Mess Items</p>
//                                 </div>
//                             </div>

//                         </div>

//                         <div className="welcome-card">
//                             <h2>Welcome to Smart Hostel Life 👋</h2>

//                             <p>
//                                 Use the sidebar to manage rooms,
//                                 students, mess menus and complaints.
//                             </p>

//                             <button
//                                 onClick={() =>
//                                     setActiveSection("ai")
//                                 }
//                             >
//                                 🤖 Open AI Insights
//                             </button>
//                         </div>

//                     </section>
//                 )}

//                 {/* =========================
//                     ROOMS
//                 ========================= */}

//                 {activeSection === "rooms" && (
//                     <section className="content-section">

//                         <h2>🛏️ Hostel Rooms</h2>

//                         <div className="form-card">

//                             <h3>🏠 Create Hostel Room</h3>

//                             <form onSubmit={handleSubmit}>

//                                 <div className="form-grid">

//                                     <div>
//                                         <label>Room Number</label>

//                                         <input
//                                             type="text"
//                                             name="roomNumber"
//                                             placeholder="Example: A101"
//                                             value={formData.roomNumber}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label>Block</label>

//                                         <input
//                                             type="text"
//                                             name="block"
//                                             placeholder="Example: A Block"
//                                             value={formData.block}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label>Floor</label>

//                                         <input
//                                             type="number"
//                                             name="floor"
//                                             placeholder="Example: 1"
//                                             value={formData.floor}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label>Capacity</label>

//                                         <input
//                                             type="number"
//                                             name="capacity"
//                                             placeholder="Example: 4"
//                                             min="1"
//                                             value={formData.capacity}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                 </div>

//                                 <button type="submit">
//                                     Create Room
//                                 </button>

//                             </form>

//                         </div>

//                         <div className="table-card">

//                             <h3>All Hostel Rooms</h3>

//                             {rooms.length === 0 ? (
//                                 <p>No rooms available.</p>
//                             ) : (
//                                 <div className="table-container">

//                                     <table>

//                                         <thead>
//                                             <tr>
//                                                 <th>Room</th>
//                                                 <th>Block</th>
//                                                 <th>Floor</th>
//                                                 <th>Capacity</th>
//                                                 <th>Occupied</th>
//                                                 <th>Available</th>
//                                                 <th>Students</th>
//                                             </tr>
//                                         </thead>

//                                         <tbody>

//                                             {rooms.map((room) => (
//                                                 <tr key={room._id}>

//                                                     <td>
//                                                         {room.roomNumber}
//                                                     </td>

//                                                     <td>
//                                                         {room.block}
//                                                     </td>

//                                                     <td>
//                                                         {room.floor}
//                                                     </td>

//                                                     <td>
//                                                         {room.capacity}
//                                                     </td>

//                                                     <td>
//                                                         {room.occupiedBeds}
//                                                     </td>

//                                                     <td>
//                                                         {room.capacity -
//                                                             room.occupiedBeds}
//                                                     </td>

//                                                     <td>
//                                                         {room.students?.length > 0
//                                                             ? room.students.map(
//                                                                 (student) => (
//                                                                     <div
//                                                                         key={
//                                                                             student._id
//                                                                         }
//                                                                     >
//                                                                         {student.name}
//                                                                     </div>
//                                                                 )
//                                                             )
//                                                             : "No students"}
//                                                     </td>

//                                                 </tr>
//                                             ))}

//                                         </tbody>

//                                     </table>

//                                 </div>
//                             )}

//                         </div>

//                     </section>
//                 )}

//                 {/* =========================
//                     STUDENTS
//                 ========================= */}

//                 {activeSection === "students" && (
//                     <section className="content-section">

//                         <h2>👨‍🎓 Students</h2>

//                         <div className="form-card">

//                             <h3>Assign Student to Room</h3>

//                             <form onSubmit={handleAssignRoom}>

//                                 <div className="form-grid">

//                                     <div>
//                                         <label>Student</label>

//                                         <select
//                                             name="studentId"
//                                             value={assignmentData.studentId}
//                                             onChange={handleAssignmentChange}
//                                             required
//                                         >
//                                             <option value="">
//                                                 Select Student
//                                             </option>

//                                             {students.map((student) => (
//                                                 <option
//                                                     key={student._id}
//                                                     value={student._id}
//                                                 >
//                                                     {student.name} -{" "}
//                                                     {student.email}
//                                                 </option>
//                                             ))}

//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label>Room</label>

//                                         <select
//                                             name="roomId"
//                                             value={assignmentData.roomId}
//                                             onChange={handleAssignmentChange}
//                                             required
//                                         >
//                                             <option value="">
//                                                 Select Room
//                                             </option>

//                                             {rooms
//                                                 .filter(
//                                                     (room) =>
//                                                         room.occupiedBeds <
//                                                         room.capacity
//                                                 )
//                                                 .map((room) => (
//                                                     <option
//                                                         key={room._id}
//                                                         value={room._id}
//                                                     >
//                                                         {room.roomNumber} -{" "}
//                                                         {room.block}{" "}
//                                                         (Available:{" "}
//                                                         {room.capacity -
//                                                             room.occupiedBeds}
//                                                         )
//                                                     </option>
//                                                 ))}

//                                         </select>
//                                     </div>

//                                 </div>

//                                 <button type="submit">
//                                     Assign Room
//                                 </button>

//                             </form>

//                         </div>

//                         <div className="table-card">

//                             <h3>Registered Students</h3>

//                             <div className="table-container">

//                                 <table>

//                                     <thead>
//                                         <tr>
//                                             <th>Name</th>
//                                             <th>Email</th>
//                                             <th>Room</th>
//                                         </tr>
//                                     </thead>

//                                     <tbody>

//                                         {students.map((student) => (
//                                             <tr key={student._id}>

//                                                 <td>
//                                                     {student.name}
//                                                 </td>

//                                                 <td>
//                                                     {student.email}
//                                                 </td>

//                                                 <td>
//                                                     {student.room?.roomNumber ||
//                                                         "Not Assigned"}
//                                                 </td>

//                                             </tr>
//                                         ))}

//                                     </tbody>

//                                 </table>

//                             </div>

//                         </div>

//                     </section>
//                 )}

//                 {/* =========================
//                     MESS MENU
//                 ========================= */}

//                 {activeSection === "mess" && (
//                     <section className="content-section">

//                         <h2>🍴 Manage Mess Menu</h2>

//                         <div className="form-card">

//                             <h3>Add Mess Menu</h3>

//                             <form onSubmit={handleMessSubmit}>

//                                 <div className="form-grid">

//                                     <div>
//                                         <label>Day</label>

//                                         <select
//                                             name="day"
//                                             value={messFormData.day}
//                                             onChange={handleMessChange}
//                                             required
//                                         >
//                                             <option value="">
//                                                 Select Day
//                                             </option>

//                                             <option value="Monday">
//                                                 Monday
//                                             </option>
//                                             <option value="Tuesday">
//                                                 Tuesday
//                                             </option>
//                                             <option value="Wednesday">
//                                                 Wednesday
//                                             </option>
//                                             <option value="Thursday">
//                                                 Thursday
//                                             </option>
//                                             <option value="Friday">
//                                                 Friday
//                                             </option>
//                                             <option value="Saturday">
//                                                 Saturday
//                                             </option>
//                                             <option value="Sunday">
//                                                 Sunday
//                                             </option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label>Meal</label>

//                                         <select
//                                             name="meal"
//                                             value={messFormData.meal}
//                                             onChange={handleMessChange}
//                                             required
//                                         >
//                                             <option value="">
//                                                 Select Meal
//                                             </option>

//                                             <option value="Breakfast">
//                                                 Breakfast
//                                             </option>
//                                             <option value="Lunch">
//                                                 Lunch
//                                             </option>
//                                             <option value="Snacks">
//                                                 Snacks
//                                             </option>
//                                             <option value="Dinner">
//                                                 Dinner
//                                             </option>
//                                         </select>
//                                     </div>

//                                     <div className="full-width">
//                                         <label>Menu</label>

//                                         <input
//                                             type="text"
//                                             name="menu"
//                                             placeholder="Example: Idly, Sambar, Chutney"
//                                             value={messFormData.menu}
//                                             onChange={handleMessChange}
//                                             required
//                                         />
//                                     </div>

//                                 </div>

//                                 <button type="submit">
//                                     Add Mess Menu
//                                 </button>

//                             </form>

//                         </div>

//                         <div className="table-card">

//                             <h3>Current Mess Menu</h3>

//                             {messMenus.length === 0 ? (
//                                 <p>No mess menu added yet.</p>
//                             ) : (
//                                 <div className="table-container">

//                                     <table>

//                                         <thead>
//                                             <tr>
//                                                 <th>Day</th>
//                                                 <th>Meal</th>
//                                                 <th>Menu</th>
//                                                 <th>Action</th>
//                                             </tr>
//                                         </thead>

//                                         <tbody>

//                                             {messMenus.map((item) => (
//                                                 <tr key={item._id}>

//                                                     <td>{item.day}</td>

//                                                     <td>{item.meal}</td>

//                                                     <td>{item.menu}</td>

//                                                     <td>
//                                                         <button
//                                                             className="delete-btn"
//                                                             onClick={() =>
//                                                                 handleDeleteMess(
//                                                                     item._id
//                                                                 )
//                                                             }
//                                                         >
//                                                             Delete
//                                                         </button>
//                                                     </td>

//                                                 </tr>
//                                             ))}

//                                         </tbody>

//                                     </table>

//                                 </div>
//                             )}

//                         </div>

//                     </section>
//                 )}

//                 {/* =========================
//                     AI INSIGHTS
//                 ========================= */}

//                 {activeSection === "ai" && (
//                     <section className="content-section">

//                         <div className="ai-page-header">

//                             <div>
//                                 <h2>🤖 AI Hostel Insights</h2>

//                                 <p>
//                                     Analyze hostel complaints using
//                                     AI-powered insights.
//                                 </p>
//                             </div>

//                             <button
//                                 className="ai-generate-btn"
//                                 onClick={fetchAIInsights}
//                                 disabled={aiLoading}
//                             >
//                                 {aiLoading
//                                     ? "Analyzing..."
//                                     : "Generate AI Insights"}
//                             </button>

//                         </div>

//                         {aiError && (
//                             <div className="error-message">
//                                 {aiError}
//                             </div>
//                         )}

//                         {aiInsights && (
//                             <div className="ai-result-card">

//                                 <h3>
//                                     📊 AI Analysis Report
//                                 </h3>

//                                 {typeof aiInsights === "string" ? (
//                                     <pre>{aiInsights}</pre>
//                                 ) : (
//                                     <>
//                                         <div className="ai-stats-grid">

//                                             <div className="ai-stat-card">
//                                                 <span>⏳</span>
//                                                 <h4>Pending</h4>
//                                                 <strong>
//                                                     {aiInsights.pending}
//                                                 </strong>
//                                             </div>

//                                             <div className="ai-stat-card">
//                                                 <span>✅</span>
//                                                 <h4>Resolved</h4>
//                                                 <strong>
//                                                     {aiInsights.resolved}
//                                                 </strong>
//                                             </div>

//                                             <div className="ai-stat-card">
//                                                 <span>🔍</span>
//                                                 <h4>Common Category</h4>
//                                                 <strong>
//                                                     {aiInsights.mostCommonCategory}
//                                                 </strong>
//                                             </div>

//                                         </div>

//                                         <div className="ai-details-grid">

//                                             <div className="ai-detail-card">
//                                                 <h3>⚠️ Key Problems</h3>

//                                                 <ul>
//                                                     {aiInsights.problems?.map(
//                                                         (problem, index) => (
//                                                             <li key={index}>
//                                                                 {problem}
//                                                             </li>
//                                                         )
//                                                     )}
//                                                 </ul>
//                                             </div>

//                                             <div className="ai-detail-card recommendation">
//                                                 <h3>
//                                                     💡 AI Recommendations
//                                                 </h3>

//                                                 <ul>
//                                                     {aiInsights.recommendations?.map(
//                                                         (
//                                                             recommendation,
//                                                             index
//                                                         ) => (
//                                                             <li key={index}>
//                                                                 {recommendation}
//                                                             </li>
//                                                         )
//                                                     )}
//                                                 </ul>
//                                             </div>

//                                         </div>
//                                     </>
//                                 )}

//                             </div>
//                         )}

//                         {!aiInsights && !aiLoading && (
//                             <div className="ai-empty-card">
//                                 <div>🤖</div>

//                                 <h3>
//                                     No AI analysis generated yet
//                                 </h3>

//                                 <p>
//                                     Click "Generate AI Insights" to
//                                     analyze the current hostel complaints.
//                                 </p>
//                             </div>
//                         )}

//                     </section>
//                 )}

//                 {/* =========================
//                     COMPLAINTS
//                 ========================= */}

//                 {activeSection === "complaints" && (
//                     <section className="content-section">

//                         <h2>🛠️ Hostel Complaints</h2>

//                         <div className="table-card">

//                             <h3>Student Complaints</h3>

//                             <div className="table-container">

//                                 <table>

//                                     <thead>
//                                         <tr>
//                                             <th>Student</th>
//                                             <th>Email</th>
//                                             <th>Category</th>
//                                             <th>Description</th>
//                                             <th>Status</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>

//                                     <tbody>

//                                         {complaints.length > 0 ? (
//                                             complaints.map((complaint) => (
//                                                 <tr
//                                                     key={complaint._id}
//                                                 >

//                                                     <td>
//                                                         {complaint.student?.name ||
//                                                             "N/A"}
//                                                     </td>

//                                                     <td>
//                                                         {complaint.student?.email ||
//                                                             "N/A"}
//                                                     </td>

//                                                     <td>
//                                                         {complaint.category}
//                                                     </td>

//                                                     <td>
//                                                         {complaint.description}
//                                                     </td>

//                                                     <td>
//                                                         <span
//                                                             className={`status ${complaint.status
//                                                                 .toLowerCase()
//                                                                 .replace(
//                                                                     " ",
//                                                                     "-"
//                                                                 )}`}
//                                                         >
//                                                             {complaint.status}
//                                                         </span>
//                                                     </td>

//                                                     <td>
//                                                         <select
//                                                             value={
//                                                                 complaint.status
//                                                             }
//                                                             onChange={(e) =>
//                                                                 handleComplaintStatus(
//                                                                     complaint._id,
//                                                                     e.target.value
//                                                                 )
//                                                             }
//                                                         >
//                                                             <option value="Pending">
//                                                                 Pending
//                                                             </option>

//                                                             <option value="In Progress">
//                                                                 In Progress
//                                                             </option>

//                                                             <option value="Resolved">
//                                                                 Resolved
//                                                             </option>
//                                                         </select>
//                                                     </td>

//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="6">
//                                                     No complaints submitted.
//                                                 </td>
//                                             </tr>
//                                         )}

//                                     </tbody>

//                                 </table>

//                             </div>

//                         </div>

//                     </section>
//                 )}

//             </main>

//         </div>
//     );
// }

// export default AdminDashboard;
//2
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [activeSection, setActiveSection] = useState("dashboard");

    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [messMenus, setMessMenus] = useState([]);

    const [aiInsights, setAiInsights] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

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

    // =========================
    // FETCH DATA
    // =========================

    const fetchRooms = async () => {
        try {
            const response = await api.get("/rooms");
            setRooms(response.data);
        } catch (error) {
            setError("Failed to fetch rooms");
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await api.get("/users/students");
            setStudents(response.data);
        } catch (error) {
            setError("Failed to fetch students");
        }
    };

    const fetchComplaints = async () => {
        try {
            const response = await api.get("/complaints");
            setComplaints(response.data);
        } catch (error) {
            console.error("COMPLAINT FETCH ERROR:", error);
            setError("Failed to fetch complaints");
        }
    };

    const fetchMessMenus = async () => {
        try {
            const response = await api.get("/mess");
            setMessMenus(response.data);
        } catch (error) {
            setError("Failed to fetch mess menus");
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchRooms();
        fetchStudents();
        fetchComplaints();
        fetchMessMenus();

        const complaintInterval = setInterval(() => {
            fetchComplaints();
        }, 3000);

        return () => {
            clearInterval(complaintInterval);
        };
    }, []);

    // =========================
    // AI INSIGHTS
    // =========================

    const fetchAIInsights = async () => {
        try {
            setAiLoading(true);
            setAiError("");

            const response = await api.get("/ai/insights");

            setAiInsights(response.data.insights);
        } catch (error) {
            console.error("AI Insights Error:", error);

            setAiError(
                error.response?.data?.message ||
                    "Failed to generate AI insights"
            );
        } finally {
            setAiLoading(false);
        }
    };

    // =========================
    // FORM HANDLERS
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAssignmentChange = (e) => {
        setAssignmentData({
            ...assignmentData,
            [e.target.name]: e.target.value
        });
    };

    const handleMessChange = (e) => {
        setMessFormData({
            ...messFormData,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // CREATE ROOM
    // =========================

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

    // =========================
    // ASSIGN STUDENT
    // =========================

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

    // =========================
    // COMPLAINT STATUS
    // =========================

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

    // =========================
    // ADD MESS MENU
    // =========================

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

    // =========================
    // DELETE MESS
    // =========================

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

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    // =========================
    // SIDEBAR
    // =========================

    const menuItems = [
        {
            id: "dashboard",
            icon: "🏠",
            label: "Dashboard"
        },
        {
            id: "rooms",
            icon: "🛏️",
            label: "Rooms"
        },
        {
            id: "students",
            icon: "👨‍🎓",
            label: "Students"
        },
        {
            id: "mess",
            icon: "🍴",
            label: "Mess Menu"
        },
        {
            id: "ai",
            icon: "🤖",
            label: "AI Insights"
        },
        {
            id: "complaints",
            icon: "🛠️",
            label: "Complaints"
        },

        // PRODUCT RESEARCH
        {
            id: "research-title",
            icon: "🔬",
            label: "Product Research",
            researchTitle: true
        },
        {
            id: "workspace",
            icon: "🧪",
            label: "Experiment Workspace",
            research: true
        },
        {
            id: "personas",
            icon: "👥",
            label: "Synthetic Personas",
            research: true
        },
        {
            id: "interview",
            icon: "💬",
            label: "Interview Mode",
            research: true
        },
        {
            id: "survey",
            icon: "📋",
            label: "Survey Mode",
            research: true
        },
        {
            id: "research-insights",
            icon: "📊",
            label: "Research Insights",
            research: true
        }
    ];

    return (
        <div className="admin-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="admin-sidebar">

                <div className="sidebar-brand">
                    🏠
                    <span>Smart Hostel</span>
                </div>

                <nav className="sidebar-menu">

                    {menuItems.map((item) => {

                        // Product Research heading
                        if (item.researchTitle) {
                            return (
                                <div
                                    key={item.id}
                                    className="research-sidebar-title"
                                >
                                    🔬 Product Research
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                className={
                                    activeSection === item.id
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() => {

                                    if (item.id === "workspace") {
                                        navigate("/workspace");
                                        return;
                                    }

                                    if (item.id === "personas") {
                                        navigate("/personas");
                                        return;
                                    }

                                    if (item.id === "interview") {
                                        alert(
                                            "Interview Mode will be available after selecting a persona."
                                        );
                                        return;
                                    }

                                    if (item.id === "survey") {
                                        navigate("/survey");
                                
                                        return;
                                    }

                                    if (item.id === "research-insights") {
                                        alert(
                                            "Research Insights will be available after Survey and Interview implementation."
                                        );
                                        return;
                                    }

                                    setActiveSection(item.id);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                <span className="sidebar-icon">
                                    {item.icon}
                                </span>

                                <span>{item.label}</span>
                            </button>
                        );
                    })}

                </nav>

                <button
                    className="sidebar-item logout-item"
                    onClick={handleLogout}
                >
                    <span className="sidebar-icon">🚪</span>
                    <span>Logout</span>
                </button>

            </aside>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="admin-main">

                {/* HEADER */}

                <header className="admin-topbar">

                    <div>
                        <h1>Admin / Warden Dashboard</h1>

                        <p>
                            Welcome, <strong>{user?.name}</strong>
                        </p>
                    </div>

                    <div className="admin-profile">
                        👤 {user?.name}
                    </div>

                </header>

                {/* GLOBAL MESSAGES */}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* =========================
                    DASHBOARD
                ========================= */}

                {activeSection === "dashboard" && (
                    <section className="dashboard-section">

                        <h2>Dashboard Overview</h2>

                        <p className="section-description">
                            Manage hostel rooms, students, mess,
                            complaints and AI-powered insights.
                        </p>

                        <div className="overview-grid">

                            <div className="overview-card">
                                <div className="overview-icon">
                                    🛏️
                                </div>

                                <div>
                                    <h3>{rooms.length}</h3>
                                    <p>Total Rooms</p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon">
                                    👨‍🎓
                                </div>

                                <div>
                                    <h3>{students.length}</h3>
                                    <p>Students</p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon">
                                    🛠️
                                </div>

                                <div>
                                    <h3>{complaints.length}</h3>
                                    <p>Complaints</p>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon">
                                    🍴
                                </div>

                                <div>
                                    <h3>{messMenus.length}</h3>
                                    <p>Mess Items</p>
                                </div>
                            </div>

                        </div>

                        <div className="welcome-card">

                            <h2>
                                Welcome to Smart Hostel Life 👋
                            </h2>

                            <p>
                                Use the sidebar to manage rooms,
                                students, mess menus and complaints.
                            </p>

                            <button
                                onClick={() =>
                                    setActiveSection("ai")
                                }
                            >
                                🤖 Open AI Insights
                            </button>

                        </div>

                    </section>
                )}

                {/* =========================
                    ROOMS
                ========================= */}

                {activeSection === "rooms" && (
                    <section className="content-section">

                        <h2>🛏️ Hostel Rooms</h2>

                        <div className="form-card">

                            <h3>🏠 Create Hostel Room</h3>

                            <form onSubmit={handleSubmit}>

                                <div className="form-grid">

                                    <div>
                                        <label>Room Number</label>

                                        <input
                                            type="text"
                                            name="roomNumber"
                                            placeholder="Example: A101"
                                            value={formData.roomNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Block</label>

                                        <input
                                            type="text"
                                            name="block"
                                            placeholder="Example: A Block"
                                            value={formData.block}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Floor</label>

                                        <input
                                            type="number"
                                            name="floor"
                                            placeholder="Example: 1"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Capacity</label>

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

                                </div>

                                <button type="submit">
                                    Create Room
                                </button>

                            </form>

                        </div>

                        <div className="table-card">

                            <h3>All Hostel Rooms</h3>

                            {rooms.length === 0 ? (
                                <p>No rooms available.</p>
                            ) : (
                                <div className="table-container">

                                    <table>

                                        <thead>
                                            <tr>
                                                <th>Room</th>
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

                                                    <td>
                                                        {room.roomNumber}
                                                    </td>

                                                    <td>
                                                        {room.block}
                                                    </td>

                                                    <td>
                                                        {room.floor}
                                                    </td>

                                                    <td>
                                                        {room.capacity}
                                                    </td>

                                                    <td>
                                                        {room.occupiedBeds}
                                                    </td>

                                                    <td>
                                                        {room.capacity -
                                                            room.occupiedBeds}
                                                    </td>

                                                    <td>
                                                        {room.students?.length > 0
                                                            ? room.students.map(
                                                                  (student) => (
                                                                      <div
                                                                          key={
                                                                              student._id
                                                                          }
                                                                      >
                                                                          {
                                                                              student.name
                                                                          }
                                                                      </div>
                                                                  )
                                                              )
                                                            : "No students"}
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </section>
                )}

                {/* =========================
                    STUDENTS
                ========================= */}

                {activeSection === "students" && (
                    <section className="content-section">

                        <h2>👨‍🎓 Students</h2>

                        <div className="form-card">

                            <h3>Assign Student to Room</h3>

                            <form onSubmit={handleAssignRoom}>

                                <div className="form-grid">

                                    <div>
                                        <label>Student</label>

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
                                                    {student.name} -{" "}
                                                    {student.email}
                                                </option>
                                            ))}

                                        </select>
                                    </div>

                                    <div>
                                        <label>Room</label>

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
                                                        room.occupiedBeds <
                                                        room.capacity
                                                )
                                                .map((room) => (
                                                    <option
                                                        key={room._id}
                                                        value={room._id}
                                                    >
                                                        {room.roomNumber} -{" "}
                                                        {room.block}{" "}
                                                        (Available:{" "}
                                                        {room.capacity -
                                                            room.occupiedBeds}
                                                        )
                                                    </option>
                                                ))}

                                        </select>
                                    </div>

                                </div>

                                <button type="submit">
                                    Assign Room
                                </button>

                            </form>

                        </div>

                        <div className="table-card">

                            <h3>Registered Students</h3>

                            <div className="table-container">

                                <table>

                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Room</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {students.map((student) => (
                                            <tr key={student._id}>

                                                <td>
                                                    {student.name}
                                                </td>

                                                <td>
                                                    {student.email}
                                                </td>

                                                <td>
                                                    {student.room?.roomNumber ||
                                                        "Not Assigned"}
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>
                )}

                {/* =========================
                    MESS MENU
                ========================= */}

                {activeSection === "mess" && (
                    <section className="content-section">

                        <h2>🍴 Manage Mess Menu</h2>

                        <div className="form-card">

                            <h3>Add Mess Menu</h3>

                            <form onSubmit={handleMessSubmit}>

                                <div className="form-grid">

                                    <div>
                                        <label>Day</label>

                                        <select
                                            name="day"
                                            value={messFormData.day}
                                            onChange={handleMessChange}
                                            required
                                        >

                                            <option value="">
                                                Select Day
                                            </option>

                                            <option value="Monday">
                                                Monday
                                            </option>

                                            <option value="Tuesday">
                                                Tuesday
                                            </option>

                                            <option value="Wednesday">
                                                Wednesday
                                            </option>

                                            <option value="Thursday">
                                                Thursday
                                            </option>

                                            <option value="Friday">
                                                Friday
                                            </option>

                                            <option value="Saturday">
                                                Saturday
                                            </option>

                                            <option value="Sunday">
                                                Sunday
                                            </option>

                                        </select>
                                    </div>

                                    <div>
                                        <label>Meal</label>

                                        <select
                                            name="meal"
                                            value={messFormData.meal}
                                            onChange={handleMessChange}
                                            required
                                        >

                                            <option value="">
                                                Select Meal
                                            </option>

                                            <option value="Breakfast">
                                                Breakfast
                                            </option>

                                            <option value="Lunch">
                                                Lunch
                                            </option>

                                            <option value="Snacks">
                                                Snacks
                                            </option>

                                            <option value="Dinner">
                                                Dinner
                                            </option>

                                        </select>
                                    </div>

                                    <div className="full-width">

                                        <label>Menu</label>

                                        <input
                                            type="text"
                                            name="menu"
                                            placeholder="Example: Idly, Sambar, Chutney"
                                            value={messFormData.menu}
                                            onChange={handleMessChange}
                                            required
                                        />

                                    </div>

                                </div>

                                <button type="submit">
                                    Add Mess Menu
                                </button>

                            </form>

                        </div>

                        <div className="table-card">

                            <h3>Current Mess Menu</h3>

                            {messMenus.length === 0 ? (
                                <p>No mess menu added yet.</p>
                            ) : (
                                <div className="table-container">

                                    <table>

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
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDeleteMess(
                                                                    item._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                        </div>

                    </section>
                )}

                {/* =========================
                    AI INSIGHTS
                ========================= */}

                {activeSection === "ai" && (
                    <section className="content-section">

                        <div className="ai-page-header">

                            <div>

                                <h2>🤖 AI Hostel Insights</h2>

                                <p>
                                    Analyze hostel complaints using
                                    AI-powered insights.
                                </p>

                            </div>

                            <button
                                className="ai-generate-btn"
                                onClick={fetchAIInsights}
                                disabled={aiLoading}
                            >
                                {aiLoading
                                    ? "Analyzing..."
                                    : "Generate AI Insights"}
                            </button>

                        </div>

                        {aiError && (
                            <div className="error-message">
                                {aiError}
                            </div>
                        )}

                        {aiInsights && (
                            <div className="ai-result-card">

                                <h3>
                                    📊 AI Analysis Report
                                </h3>

                                {typeof aiInsights === "string" ? (
                                    <pre>{aiInsights}</pre>
                                ) : (
                                    <>
                                        <div className="ai-stats-grid">

                                            <div className="ai-stat-card">
                                                <span>⏳</span>
                                                <h4>Pending</h4>

                                                <strong>
                                                    {aiInsights.pending}
                                                </strong>
                                            </div>

                                            <div className="ai-stat-card">
                                                <span>✅</span>
                                                <h4>Resolved</h4>

                                                <strong>
                                                    {aiInsights.resolved}
                                                </strong>
                                            </div>

                                            <div className="ai-stat-card">
                                                <span>🔍</span>
                                                <h4>Common Category</h4>

                                                <strong>
                                                    {
                                                        aiInsights.mostCommonCategory
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="ai-details-grid">

                                            <div className="ai-detail-card">

                                                <h3>
                                                    ⚠️ Key Problems
                                                </h3>

                                                <ul>
                                                    {aiInsights.problems?.map(
                                                        (
                                                            problem,
                                                            index
                                                        ) => (
                                                            <li key={index}>
                                                                {problem}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>

                                            </div>

                                            <div className="ai-detail-card recommendation">

                                                <h3>
                                                    💡 AI Recommendations
                                                </h3>

                                                <ul>
                                                    {aiInsights.recommendations?.map(
                                                        (
                                                            recommendation,
                                                            index
                                                        ) => (
                                                            <li key={index}>
                                                                {
                                                                    recommendation
                                                                }
                                                            </li>
                                                        )
                                                    )}
                                                </ul>

                                            </div>

                                        </div>
                                    </>
                                )}

                            </div>
                        )}

                        {!aiInsights && !aiLoading && (
                            <div className="ai-empty-card">

                                <div>🤖</div>

                                <h3>
                                    No AI analysis generated yet
                                </h3>

                                <p>
                                    Click "Generate AI Insights" to
                                    analyze the current hostel complaints.
                                </p>

                            </div>
                        )}

                    </section>
                )}

                {/* =========================
                    COMPLAINTS
                ========================= */}

                {activeSection === "complaints" && (
                    <section className="content-section">

                        <h2>🛠️ Hostel Complaints</h2>

                        <div className="table-card">

                            <h3>Student Complaints</h3>

                            <div className="table-container">

                                <table>

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
                                                <tr
                                                    key={complaint._id}
                                                >

                                                    <td>
                                                        {complaint.student?.name ||
                                                            "N/A"}
                                                    </td>

                                                    <td>
                                                        {complaint.student?.email ||
                                                            "N/A"}
                                                    </td>

                                                    <td>
                                                        {complaint.category}
                                                    </td>

                                                    <td>
                                                        {complaint.description}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`status ${complaint.status
                                                                .toLowerCase()
                                                                .replace(
                                                                    " ",
                                                                    "-"
                                                                )}`}
                                                        >
                                                            {complaint.status}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <select
                                                            value={
                                                                complaint.status
                                                            }
                                                            onChange={(e) =>
                                                                handleComplaintStatus(
                                                                    complaint._id,
                                                                    e.target
                                                                        .value
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

                        </div>

                    </section>
                )}

            </main>

        </div>
    );
}

export default AdminDashboard;