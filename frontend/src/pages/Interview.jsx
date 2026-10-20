import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import "./Interview.css";

function Interview() {
    const { personaId } = useParams();
    const navigate = useNavigate();

    const [persona, setPersona] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // LOAD SELECTED PERSONA
    // =====================================================

    useEffect(() => {
        const savedPersona =
            localStorage.getItem("selectedPersona");

        if (savedPersona) {
            const parsedPersona = JSON.parse(savedPersona);

            setPersona(parsedPersona);

            // If conversation already exists,
            // display previous conversation
            if (
                parsedPersona.conversationHistory &&
                parsedPersona.conversationHistory.length > 0
            ) {
                setMessages(
                    parsedPersona.conversationHistory.map(
                        (chat) => ({
                            role: chat.role,
                            message: chat.message
                        })
                    )
                );
            }
        }
    }, []);

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {
        if (!message.trim() || loading) {
            return;
        }

        const userMessage = message.trim();

        // Show user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                message: userMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/personas/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        personaId: personaId,
                        message: userMessage
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to get persona response"
                );
            }

            // Add AI persona response
            setMessages((prev) => [
                ...prev,
                {
                    role: "persona",
                    message: data.response
                }
            ]);

            // Update local persona with latest
            // conversation history
            if (data.conversationHistory) {
                const updatedPersona = {
                    ...persona,
                    conversationHistory:
                        data.conversationHistory
                };

                setPersona(updatedPersona);

                localStorage.setItem(
                    "selectedPersona",
                    JSON.stringify(updatedPersona)
                );
            }

        } catch (error) {
            console.error(
                "Interview Error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "persona",
                    message:
                        "Sorry, I couldn't respond right now. Please try again."
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // =====================================================
    // PERSONA NOT FOUND
    // =====================================================

    if (!persona) {
        return (
            <div className="interview-page">

                <div className="interview-error">

                    <h2>
                        Persona not found
                    </h2>

                    <p>
                        Please select a persona first.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/personas")
                        }
                    >
                        Back to Personas
                    </button>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN INTERVIEW UI
    // =====================================================

    return (
        <div className="interview-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="interview-top">

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/personas")
                    }
                >
                    ← Back to Personas
                </button>

                <div className="interview-title">

                    <h1>
                        Interview Mode
                    </h1>

                    <p>
                        Conduct a conversational interview
                        with a synthetic research persona
                    </p>

                </div>

            </div>


            {/* =================================================
                PERSONA PROFILE
            ================================================= */}

            <div className="persona-profile">

                <div className="large-avatar">

                    {persona.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                </div>

                <div className="profile-info">

                    <h2>
                        {persona.name}
                    </h2>

                    <p>
                        {persona.age} years
                        {" • "}
                        {persona.occupation}
                    </p>

                    <div className="profile-tags">

                        {persona.personalityTraits?.map(
                            (trait, index) => (
                                <span key={index}>
                                    {trait}
                                </span>
                            )
                        )}

                    </div>

                </div>

                <div className="synthetic-label">
                    Synthetic User
                </div>

            </div>


            {/* =================================================
                CHAT CONTAINER
            ================================================= */}

            <div className="chat-container">

                {/* CHAT HEADER */}

                <div className="chat-header">

                    <div>

                        <h3>
                            Interview with{" "}
                            {persona.name}
                        </h3>

                        <p>
                            Ask questions about the
                            product, preferences,
                            experiences and concerns.
                        </p>

                    </div>

                    <div className="memory-status">
                        🧠 Memory Enabled
                    </div>

                </div>


                {/* =================================================
                    CHAT MESSAGES
                ================================================= */}

                <div className="chat-messages">

                    {/* Initial message */}

                    {messages.length === 0 && (
                        <div className="welcome-message">

                            <div className="welcome-icon">
                                💬
                            </div>

                            <h3>
                                Start the Interview
                            </h3>

                            <p>
                                Ask {persona.name} about
                                their experience, needs,
                                preferences or concerns
                                regarding the product.
                            </p>

                            <div className="sample-questions">

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "What do you think about this product?"
                                        )
                                    }
                                >
                                    What do you think
                                    about this product?
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "What feature would be most useful to you?"
                                        )
                                    }
                                >
                                    What feature would
                                    be most useful?
                                </button>

                                <button
                                    onClick={() =>
                                        setMessage(
                                            "What concerns would you have about using this product?"
                                        )
                                    }
                                >
                                    What concerns do
                                    you have?
                                </button>

                            </div>

                        </div>
                    )}


                    {/* Conversation messages */}

                    {messages.map((chat, index) => (

                        <div
                            key={index}
                            className={`message ${
                                chat.role === "user"
                                    ? "user-message"
                                    : "persona-message"
                            }`}
                        >

                            <div className="message-label">

                                {chat.role === "user"
                                    ? "Researcher"
                                    : persona.name}

                            </div>

                            <div className="message-text">

                                {chat.message}

                            </div>

                        </div>

                    ))}


                    {/* Loading */}

                    {loading && (

                        <div className="message persona-message">

                            <div className="message-label">
                                {persona.name}
                            </div>

                            <div className="typing">

                                <span></span>
                                <span></span>
                                <span></span>

                                <span className="thinking-text">
                                    Thinking...
                                </span>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    INPUT AREA
                ================================================= */}

                <div className="chat-input">

                    <input
                        type="text"
                        placeholder={`Ask ${persona.name} a question...`}
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />

                    <button
                        onClick={sendMessage}
                        disabled={
                            loading ||
                            !message.trim()
                        }
                    >
                        {loading
                            ? "..."
                            : "Send"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Interview;