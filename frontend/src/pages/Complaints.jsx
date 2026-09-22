import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Complaints() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [complaints, setComplaints] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchComplaints = async () => {
        try {
            const response = await api.get(
                `/complaints/student/${user.id}`
            );

            setComplaints(response.data);

        } catch (error) {
            setError("Failed to fetch complaints");
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchComplaints();
        }
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
        console.log("Sending complaint:", {
            student: user.id,
            category,
            description
        });

        const response = await api.post("/complaints", {
            student: user.id,
            category,
            description
        });

        console.log("Complaint Response:", response.data);

        setMessage("Complaint submitted successfully!");

        setCategory("");
        setDescription("");

        fetchComplaints();

    } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("ERROR:", error);

        setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to submit complaint"
        );
    }
};

    return (
        <div style={{ padding: "30px" }}>

            <button onClick={() => navigate("/student")}>
                ← Back to Dashboard
            </button>

            <h1>Complaints</h1>

            <hr />

            <h2>Raise a Complaint</h2>

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
                    <label>Category</label>
                    <br />

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        <option value="Room">
                            Room
                        </option>

                        <option value="Mess">
                            Mess
                        </option>

                        <option value="Maintenance">
                            Maintenance
                        </option>

                        <option value="Electricity">
                            Electricity
                        </option>

                        <option value="Water">
                            Water
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>

                <br />

                <div>
                    <label>Description</label>
                    <br />

                    <textarea
                        rows="5"
                        cols="40"
                        placeholder="Describe your complaint"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Submit Complaint
                </button>

            </form>

            <hr />

            <h2>My Complaints</h2>

            {complaints.length === 0 ? (
                <p>
                    No complaints submitted yet.
                </p>
            ) : (
                <table border="1" cellPadding="10">

                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {complaints.map((complaint) => (
                            <tr key={complaint._id}>

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
                                    {new Date(
                                        complaint.createdAt
                                    ).toLocaleDateString()}
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Complaints;