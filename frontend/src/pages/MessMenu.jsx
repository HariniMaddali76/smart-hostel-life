import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MessMenu() {
    const navigate = useNavigate();

    const [messMenus, setMessMenus] = useState([]);
    const [error, setError] = useState("");

    const fetchMessMenus = async () => {
        try {
            const response = await api.get("/mess");
            setMessMenus(response.data);
        } catch (error) {
            setError("Failed to fetch mess menu");
        }
    };

    useEffect(() => {
        fetchMessMenus();
    }, []);

    return (
        <div style={{ padding: "30px" }}>

            <button onClick={() => navigate("/student")}>
                ← Back to Dashboard
            </button>

            <h1>🍴 Hostel Mess Menu</h1>

            <hr />

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {messMenus.length === 0 ? (
                <p>No mess menu available.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Meal</th>
                            <th>Menu</th>
                        </tr>
                    </thead>

                    <tbody>
                        {messMenus.map((item) => (
                            <tr key={item._id}>
                                <td>{item.day}</td>
                                <td>{item.meal}</td>
                                <td>{item.menu}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default MessMenu;