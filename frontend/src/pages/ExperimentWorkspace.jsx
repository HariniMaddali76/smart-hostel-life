import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExperimentWorkspace.css";

function ExperimentWorkspace() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productName: "",
        productDescription: "",
        targetAudience: "",
        researchObjectives: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        localStorage.setItem(
            "researchExperiment",
            JSON.stringify(formData)
        );

        navigate("/personas");
    };

    return (
        <div className="workspace-page">

            <div className="workspace-card">

                <h1>Experiment Workspace</h1>

                <p className="subtitle">
                    Define your product and research goals
                    before generating synthetic users.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="e.g. Smart Hostel Life App"
                        required
                    />

                    <label>Product Description</label>
                    <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        rows="4"
                        required
                    />

                    <label>Target Audience</label>
                    <textarea
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        placeholder="e.g. College hostel students"
                        rows="3"
                        required
                    />

                    <label>Research Objectives</label>
                    <textarea
                        name="researchObjectives"
                        value={formData.researchObjectives}
                        onChange={handleChange}
                        placeholder="What do you want to learn from synthetic users?"
                        rows="4"
                        required
                    />

                    <button type="submit">
                        Continue to Persona Generation →
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ExperimentWorkspace;