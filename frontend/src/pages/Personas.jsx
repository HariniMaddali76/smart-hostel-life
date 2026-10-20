import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import "./Personas.css";

function Personas() {
    const navigate = useNavigate();

    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedPersonas = localStorage.getItem("syntheticPersonas");

        if (savedPersonas) {
            setPersonas(JSON.parse(savedPersonas));
        }
    }, []);

    const generatePersonas = async () => {
        try {
            setLoading(true);
            setError("");

            const experiment = JSON.parse(
                localStorage.getItem("researchExperiment")
            );

            if (!experiment) {
                setError("Experiment details not found.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/personas/generate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productName: experiment.productName,
                        productDescription:
                            experiment.productDescription,
                        targetAudience: experiment.targetAudience,
                        researchObjectives:
                            experiment.researchObjectives
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to generate personas"
                );
            }

            setPersonas(data.personas);

            localStorage.setItem(
                "syntheticPersonas",
                JSON.stringify(data.personas)
            );

        } catch (error) {
            console.error("Persona Generation Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const startInterview = (persona) => {
        // Store selected persona
        localStorage.setItem(
            "selectedPersona",
            JSON.stringify(persona)
        );

        // Navigate to Interview Mode
        navigate(`/interview/${persona._id}`);
    };

    return (
        <div className="personas-page">

            {/* HEADER */}

            <div className="personas-header">

                <div>
                    <h1>Synthetic Personas</h1>

                    <p>
                        AI-generated users for product research
                    </p>
                </div>

                <button
                    className="generate-btn"
                    onClick={generatePersonas}
                    disabled={loading}
                >
                    {loading
                        ? "Generating..."
                        : "Generate Personas"}
                </button>

            </div>

            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* PERSONAS */}

            {personas.length > 0 ? (

                <div className="personas-grid">

                    {personas.map((persona) => (

                        <div
                            className="persona-card"
                            key={persona._id}
                        >

                            {/* AVATAR */}

                            <div className="persona-avatar">
                                {persona.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            {/* BASIC DETAILS */}

                            <h2>{persona.name}</h2>

                            <p className="persona-basic">
                                {persona.age} years •{" "}
                                {persona.occupation}
                            </p>

                            {/* PERSONALITY */}

                            <div className="persona-section">

                                <h3>
                                    Personality
                                </h3>

                                <div className="tag-container">

                                    {persona.personalityTraits?.map(
                                        (trait, index) => (

                                            <span
                                                className="tag"
                                                key={index}
                                            >
                                                {trait}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>

                            {/* BEHAVIOR */}

                            <div className="persona-section">

                                <h3>
                                    Behavioral Patterns
                                </h3>

                                <ul>

                                    {persona.behavioralPatterns?.map(
                                        (behavior, index) => (

                                            <li key={index}>
                                                {behavior}
                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>

                            {/* PSYCHOLOGICAL PROFILE */}

                            <div className="persona-section">

                                <h3>
                                    Goals
                                </h3>

                                <ul>

                                    {persona.psychologicalProfile
                                        ?.goals?.map(
                                            (goal, index) => (

                                                <li key={index}>
                                                    {goal}
                                                </li>

                                            )
                                        )}

                                </ul>

                            </div>

                            <div className="persona-section">

                                <h3>
                                    Frustrations
                                </h3>

                                <ul>

                                    {persona.psychologicalProfile
                                        ?.frustrations?.map(
                                            (item, index) => (

                                                <li key={index}>
                                                    {item}
                                                </li>

                                            )
                                        )}

                                </ul>

                            </div>

                            {/* INTERVIEW BUTTON */}

                            <button
                                className="interview-btn"
                                onClick={() =>
                                    startInterview(persona)
                                }
                            >
                                Start Interview
                            </button>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="empty-personas">

                    <h2>
                        No personas generated yet
                    </h2>

                    <p>
                        Click "Generate Personas" to create
                        synthetic research users.
                    </p>

                </div>

            )}

        </div>
    );
}

export default Personas;
