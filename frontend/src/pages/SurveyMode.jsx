// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SurveyMode.css";
// import { jsPDF } from "jspdf";

// function SurveyMode() {
//     const navigate = useNavigate();

//     const [personas, setPersonas] = useState([]);
//     const [selectedIds, setSelectedIds] = useState([]);
//     const [questions, setQuestions] = useState([""]);
//     const [results, setResults] = useState([]);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const [insights, setInsights] = useState(null);
//     const [insightsLoading, setInsightsLoading] = useState(false);
//     const [insightsError, setInsightsError] = useState("");

//     // Load saved personas
//     useEffect(() => {
//         try {
//             const savedPersonas = JSON.parse(
//                 localStorage.getItem("syntheticPersonas") || "[]"
//             );

//             if (Array.isArray(savedPersonas)) {
//                 setPersonas(savedPersonas);
//             } else {
//                 setError("Saved persona data is invalid.");
//             }
//         } catch (err) {
//             console.error("Load personas error:", err);
//             setError("Unable to load saved personas.");
//         }
//     }, []);

//     // Select or deselect a persona
//     const togglePersona = (personaId) => {
//         setSelectedIds((previous) =>
//             previous.includes(personaId)
//                 ? previous.filter((id) => id !== personaId)
//                 : [...previous, personaId]
//         );
//     };

//     // Add a survey question
//     const addQuestion = () => {
//         if (questions.length < 10) {
//             setQuestions((previous) => [...previous, ""]);
//         }
//     };

//     // Update a question
//     const updateQuestion = (index, value) => {
//         setQuestions((previous) =>
//             previous.map((question, i) =>
//                 i === index ? value : question
//             )
//         );
//     };

//     // Remove a question
//     const removeQuestion = (index) => {
//         if (questions.length > 1) {
//             setQuestions((previous) =>
//                 previous.filter((_, i) => i !== index)
//             );
//         }
//     };

//     // Generate survey responses
//     const generateSurvey = async () => {
//         setError("");
//         setSuccess("");
//         setResults([]);
//         setInsights(null);
//         setInsightsError("");

//         const validQuestions = questions
//             .map((question) => question.trim())
//             .filter(Boolean);

//         if (selectedIds.length === 0) {
//             setError("Please select at least one persona.");
//             return;
//         }

//         if (validQuestions.length === 0) {
//             setError("Please enter at least one survey question.");
//             return;
//         }

//         if (validQuestions.length > 10) {
//             setError("Maximum 10 questions are allowed.");
//             return;
//         }

//         try {
//             setLoading(true);

//             const response = await fetch(
//                 "http://localhost:5000/api/personas/survey",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         personaIds: selectedIds,
//                         questions: validQuestions
//                     })
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message || "Failed to generate survey."
//                 );
//             }

//             const surveyResults = data.results || [];

//             setResults(surveyResults);

//             setSuccess(
//                 `Survey completed for ${
//                     data.totalPersonas ?? surveyResults.length
//                 } synthetic personas.`
//             );
//         } catch (err) {
//             console.error("Survey Error:", err);
//             setError(
//                 err.message || "Unable to generate survey."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Generate research insights from survey responses
//     const generateResearchInsights = async () => {
//         setInsightsError("");
//         setInsights(null);

//         if (!results.length) {
//             setInsightsError(
//                 "Generate survey responses first."
//             );
//             return;
//         }

//         try {
//             setInsightsLoading(true);

//             const surveyQuestions = (
//                 results[0]?.answers || []
//             ).map((item) => item.question);

//             const response = await fetch(
//                 "http://localhost:5000/api/personas/insights",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         results,
//                         questions: surveyQuestions
//                     })
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message || "Failed to extract insights."
//                 );
//             }

//             if (!data.insights) {
//                 throw new Error(
//                     "No insights were returned by the server."
//                 );
//             }

//             setInsights(data.insights);
//         } catch (err) {
//             console.error(
//                 "Insight Extraction Error:",
//                 err
//             );

//             setInsightsError(
//                 err.message ||
//                     "Unable to generate research insights."
//             );
//         } finally {
//             setInsightsLoading(false);
//         }
//     };

//     // Download Research Report as PDF
//     const downloadResearchReport = () => {
//         if (!results.length || !insights) {
//             setInsightsError(
//                 "Generate survey responses and research insights first."
//             );
//             return;
//         }

//         const doc = new jsPDF();
//         const pageHeight = doc.internal.pageSize.getHeight();
//         const pageWidth = doc.internal.pageSize.getWidth();

//         let y = 20;

//         const addText = (text, options = {}) => {
//             const {
//                 size = 10,
//                 bold = false,
//                 gap = 6
//             } = options;

//             doc.setFont("helvetica", bold ? "bold" : "normal");
//             doc.setFontSize(size);

//             const lines = doc.splitTextToSize(
//                 String(text ?? "Not available"),
//                 pageWidth - 30
//             );

//             const requiredHeight = lines.length * (size * 0.45) + gap;

//             if (y + requiredHeight > pageHeight - 15) {
//                 doc.addPage();
//                 y = 20;
//             }

//             doc.text(lines, 15, y);
//             y += requiredHeight;
//         };

//         const addSection = (title) => {
//             y += 3;
//             addText(title, { size: 14, bold: true, gap: 8 });
//         };

//         // Report title
//         addText("Smart Hostel Life App", {
//             size: 20,
//             bold: true,
//             gap: 9
//         });

//         addText("AI-Powered Synthetic User Research Report", {
//             size: 14,
//             bold: true,
//             gap: 8
//         });

//         addText(`Generated on: ${new Date().toLocaleDateString()}`);
//         addText(`Personas surveyed: ${results.length}`);
//         addText(
//             `Questions asked: ${results[0]?.answers?.length || 0}`
//         );

//         // Persona profiles
//         addSection("1. Persona Profiles");

//         results.forEach((result, index) => {
//             const profile = personas.find(
//                 (persona) =>
//                     String(persona._id) ===
//                     String(result.personaId || result._id)
//             );

//             addText(`${index + 1}. ${result.name || profile?.name || "Persona"}`, {
//                 bold: true
//             });

//             addText(
//                 `Age: ${profile?.age ?? "Not available"} | Occupation: ${
//                     result.occupation || profile?.occupation || "Not available"
//                 }`
//             );

//             addText(
//                 `Personality: ${
//                     profile?.personalityTraits?.join(", ") ||
//                     "Not available"
//                 }`
//             );

//             addText(
//                 `Behavioral patterns: ${
//                     profile?.behavioralPatterns?.join(", ") ||
//                     "Not available"
//                 }`
//             );
//         });

//         // Survey response highlights
//         addSection("2. Survey Response Highlights");

//         results.forEach((result) => {
//             addText(result.name || "Synthetic Persona", {
//                 bold: true
//             });

//             (result.answers || []).forEach((item, index) => {
//                 addText(`Q${index + 1}: ${item.question}`);
//                 addText(`Response: ${item.answer}`);
//             });
//         });

//         // Research summary
//         addSection("3. Research Insight Summary");
//         addText(insights.summary || "No summary available.");

//         // Sentiment breakdown
//         addSection("4. Sentiment Breakdown");

//         const sentiment = insights.sentiment || {};

//         addText(`Positive: ${sentiment.positive ?? "N/A"}`);
//         addText(`Neutral: ${sentiment.neutral ?? "N/A"}`);
//         addText(`Negative: ${sentiment.negative ?? "N/A"}`);

//         if (sentiment.summary) {
//             addText(sentiment.summary);
//         }

//         // Recurring themes
//         addSection("5. Theme Clusters");

//         (insights.recurringThemes || []).forEach((item) => {
//             addText(item.theme || "Theme", { bold: true });
//             addText(item.evidence || "No evidence provided.");
//             addText(`Persona frequency: ${item.frequency ?? "N/A"}`);
//         });

//         // Key persona quotes
//         addSection("6. Key Persona Quotes");

//         results.forEach((result) => {
//             const firstAnswer = result.answers?.find(
//                 (item) => item.answer
//             );

//             if (firstAnswer) {
//                 addText(
//                     `${result.name || "Persona"} — "${firstAnswer.answer}"`
//                 );
//             }
//         });

//         // Agreement and disagreement
//         addSection("7. Agreement Patterns");

//         (insights.agreement || []).forEach((item) => {
//             addText(`- ${item}`);
//         });

//         if (!insights.agreement?.length) {
//             addText("No agreement findings available.");
//         }

//         addSection("8. Disagreement Patterns");

//         (insights.disagreements || []).forEach((item) => {
//             addText(`- ${item}`);
//         });

//         if (!insights.disagreements?.length) {
//             addText("No disagreement findings available.");
//         }

//         // Adoption and validation insights
//         addSection("9. Product Adoption Insights");

//         (insights.adoptionInsights || []).forEach((item) => {
//             addText(item.name || "Product Feature", { bold: true });
//             addText(`Adoption likelihood: ${item.likelihood || "N/A"}`);
//             addText(item.reasoning || "No reasoning provided.");
//         });

//         if (!insights.adoptionInsights?.length) {
//             addText("No adoption insights available.");
//         }

//         // Product recommendations
//         addSection("10. Recommendations");

//         (insights.recommendations || []).forEach((item) => {
//             addText(`- ${item}`);
//         });

//         if (!insights.recommendations?.length) {
//             addText("No recommendations available.");
//         }

//         doc.save("synthetic-user-research-report.pdf");
//     };

//     return (
//         <div className="survey-page">

//             {/* Page Header */}
//             <header className="survey-header">
//                 <div>
//                     <p className="survey-eyebrow">
//                         PRODUCT RESEARCH
//                     </p>

//                     <h1>Survey Mode</h1>

//                     <p>
//                         Ask the same questions to multiple synthetic
//                         personas and compare their responses.
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     className="survey-back-btn"
//                     onClick={() => navigate("/personas")}
//                 >
//                     ← Personas
//                 </button>
//             </header>

//             {/* Error Message */}
//             {error && (
//                 <div className="survey-alert survey-error">
//                     {error}
//                 </div>
//             )}

//             {/* Success Message */}
//             {success && (
//                 <div className="survey-alert survey-success">
//                     {success}
//                 </div>
//             )}

//             {/* Step 1: Select Personas */}
//             <section className="survey-section">
//                 <div className="survey-section-heading">
//                     <div>
//                         <h2>1. Select Personas</h2>

//                         <p>
//                             Choose which synthetic users should
//                             answer your questions.
//                         </p>
//                     </div>

//                     <span className="survey-count">
//                         {selectedIds.length} selected
//                     </span>
//                 </div>

//                 {personas.length === 0 ? (
//                     <div className="survey-empty">
//                         <h3>No personas available</h3>

//                         <p>
//                             Generate personas first before
//                             starting a survey.
//                         </p>

//                         <button
//                             type="button"
//                             className="survey-primary-btn"
//                             onClick={() => navigate("/personas")}
//                         >
//                             Generate Personas
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="survey-persona-grid">
//                         {personas.map((persona) => (
//                             <label
//                                 key={persona._id}
//                                 className={`survey-persona-card ${
//                                     selectedIds.includes(persona._id)
//                                         ? "selected"
//                                         : ""
//                                 }`}
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedIds.includes(
//                                         persona._id
//                                     )}
//                                     onChange={() =>
//                                         togglePersona(persona._id)
//                                     }
//                                 />

//                                 <div className="survey-avatar">
//                                     {persona.name
//                                         ?.charAt(0)
//                                         .toUpperCase()}
//                                 </div>

//                                 <div>
//                                     <h3>{persona.name}</h3>

//                                     <p>
//                                         {persona.age} years ·{" "}
//                                         {persona.occupation}
//                                     </p>

//                                     <span>
//                                         {(
//                                             persona.personalityTraits || []
//                                         )
//                                             .slice(0, 2)
//                                             .join(" · ")}
//                                     </span>
//                                 </div>
//                             </label>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Step 2: Add Questions */}
//             <section className="survey-section">
//                 <div className="survey-section-heading">
//                     <div>
//                         <h2>2. Add Survey Questions</h2>

//                         <p>
//                             Every selected persona will answer
//                             the same questions.
//                         </p>
//                     </div>

//                     <span className="survey-count">
//                         {questions.length}/10
//                     </span>
//                 </div>

//                 <div className="survey-question-list">
//                     {questions.map((question, index) => (
//                         <div
//                             className="survey-question-row"
//                             key={index}
//                         >
//                             <span className="survey-question-number">
//                                 {index + 1}
//                             </span>

//                             <input
//                                 type="text"
//                                 value={question}
//                                 onChange={(event) =>
//                                     updateQuestion(
//                                         index,
//                                         event.target.value
//                                     )
//                                 }
//                                 placeholder={`Enter question ${index + 1}`}
//                                 maxLength={500}
//                             />

//                             <button
//                                 type="button"
//                                 className="survey-remove-btn"
//                                 onClick={() =>
//                                     removeQuestion(index)
//                                 }
//                                 disabled={questions.length === 1}
//                                 aria-label={`Remove question ${index + 1}`}
//                             >
//                                 ×
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     type="button"
//                     className="survey-add-btn"
//                     onClick={addQuestion}
//                     disabled={questions.length >= 10}
//                 >
//                     + Add Question
//                 </button>

//                 <div className="survey-generate-area">
//                     <button
//                         type="button"
//                         className="survey-primary-btn"
//                         onClick={generateSurvey}
//                         disabled={
//                             loading ||
//                             personas.length === 0 ||
//                             selectedIds.length === 0
//                         }
//                     >
//                         {loading
//                             ? "Generating Responses..."
//                             : "Generate Survey"}
//                     </button>

//                     <p>
//                         Responses are AI-generated simulations,
//                         not actual feedback from real users.
//                     </p>
//                 </div>
//             </section>

//             {/* Step 3: Compare Survey Responses */}
//             {results.length > 0 && (
//                 <section className="survey-section">
//                     <div className="survey-section-heading">
//                         <div>
//                             <h2>3. Compare Responses</h2>

//                             <p>
//                                 Compare how each synthetic persona
//                                 answers every question.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="survey-results-wrapper">
//                         <table className="survey-results-table">
//                             <thead>
//                                 <tr>
//                                     <th>Survey Question</th>

//                                     {results.map((persona, index) => (
//                                         <th
//                                             key={
//                                                 persona.personaId ||
//                                                 persona._id ||
//                                                 index
//                                             }
//                                         >
//                                             <div>{persona.name}</div>

//                                             <small>
//                                                 {persona.occupation}
//                                             </small>
//                                         </th>
//                                     ))}
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {(results[0]?.answers || []).map(
//                                     (answer, questionIndex) => (
//                                         <tr key={questionIndex}>
//                                             <td className="survey-question-cell">
//                                                 <strong>
//                                                     Q{questionIndex + 1}
//                                                 </strong>

//                                                 <p>{answer.question}</p>
//                                             </td>

//                                             {results.map(
//                                                 (persona, index) => (
//                                                     <td
//                                                         key={
//                                                             persona.personaId ||
//                                                             persona._id ||
//                                                             index
//                                                         }
//                                                     >
//                                                         {persona.answers?.[
//                                                             questionIndex
//                                                         ]?.answer ||
//                                                             "No answer available."}
//                                                     </td>
//                                                 )
//                                             )}
//                                         </tr>
//                                     )
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Generate Research Insights Button */}
//                     <div className="insights-action">
//                         <button
//                             type="button"
//                             className="survey-primary-btn"
//                             onClick={generateResearchInsights}
//                             disabled={
//                                 insightsLoading || loading
//                             }
//                         >
//                             {insightsLoading
//                                 ? "Analyzing Responses..."
//                                 : "Generate Research Insights"}
//                         </button>

//                         {insightsError && (
//                             <p className="insights-error">
//                                 {insightsError}
//                             </p>
//                         )}
//                     </div>

//                     {/* Research Insights Dashboard */}
//                     {insights && (
//                         <div className="insights-dashboard">
//                             <div className="insights-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <h2>Research Insights</h2>
//                                 <button
//                                     type="button"
//                                     className="survey-primary-btn"
//                                     onClick={downloadResearchReport}
//                                     style={{ padding: "8px 16px", fontSize: "14px" }}
//                                 >
//                                     📥 Download PDF Report
//                                 </button>
//                             </div>

//                             {/* Overall Summary */}
//                             <div className="insights-card">
//                                 <h3>Overall Summary</h3>

//                                 <p>
//                                     {insights.summary ||
//                                         "No summary available."}
//                                 </p>
//                             </div>

//                             {/* Sentiment Analysis */}
//                             <div className="insights-card">
//                                 <h3>Sentiment Analysis</h3>

//                                 <div className="sentiment-grid">
//                                     <div>
//                                         <strong>
//                                             {insights.sentiment?.positive ?? 0}
//                                         </strong>

//                                         <span>Positive</span>
//                                     </div>

//                                     <div>
//                                         <strong>
//                                             {insights.sentiment?.neutral ?? 0}
//                                         </strong>

//                                         <span>Neutral</span>
//                                     </div>

//                                     <div>
//                                         <strong>
//                                             {insights.sentiment?.negative ?? 0}
//                                         </strong>

//                                         <span>Negative</span>
//                                     </div>
//                                 </div>

//                                 <p>
//                                     {insights.sentiment?.summary || ""}
//                                 </p>
//                             </div>

//                             {/* Recurring Themes */}
//                             <div className="insights-card">
//                                 <h3>Recurring Themes</h3>

//                                 {(insights.recurringThemes || []).length === 0 ? (
//                                     <p>
//                                         No recurring themes were identified.
//                                     </p>
//                                 ) : (
//                                     insights.recurringThemes.map(
//                                         (item, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="insight-item"
//                                             >
//                                                 <strong>
//                                                     {item.theme}
//                                                 </strong>

//                                                 <p>{item.evidence}</p>

//                                                 <small>
//                                                     Supported by{" "}
//                                                     {item.frequency} persona(s)
//                                                 </small>
//                                             </div>
//                                         )
//                                     )
//                                 )}
//                             </div>

//                             {/* Agreement */}
//                             <div className="insights-card">
//                                 <h3>Agreement</h3>

//                                 {(insights.agreement || []).length === 0 ? (
//                                     <p>
//                                         No common agreement identified.
//                                     </p>
//                                 ) : (
//                                     insights.agreement.map(
//                                         (item, index) => (
//                                             <p key={index}>
//                                                 • {item}
//                                             </p>
//                                         )
//                                     )
//                                 )}
//                             </div>

//                             {/* Disagreements */}
//                             <div className="insights-card">
//                                 <h3>Disagreements</h3>

//                                 {(insights.disagreements || []).length === 0 ? (
//                                     <p>
//                                         No clear disagreements identified.
//                                     </p>
//                                 ) : (
//                                     insights.disagreements.map(
//                                         (item, index) => (
//                                             <p key={index}>
//                                                 • {item}
//                                             </p>
//                                         )
//                                     )
//                                 )}
//                             </div>

//                             {/* Adoption Insights */}
//                             <div className="insights-card">
//                                 <h3>Product Adoption Insights</h3>

//                                 {(insights.adoptionInsights || []).length === 0 ? (
//                                     <p>
//                                         No adoption insights available.
//                                     </p>
//                                 ) : (
//                                     insights.adoptionInsights.map(
//                                         (item, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="insight-item"
//                                             >
//                                                 <strong>
//                                                     {item.name}
//                                                 </strong>

//                                                 <p>
//                                                     Adoption likelihood:{" "}
//                                                     {item.likelihood}
//                                                 </p>

//                                                 <p>
//                                                     {item.reasoning}
//                                                 </p>
//                                             </div>
//                                         )
//                                     )
//                                 )}
//                             </div>

//                             {/* Product Recommendations */}
//                             <div className="insights-card">
//                                 <h3>Product Recommendations</h3>

//                                 {(insights.recommendations || []).length === 0 ? (
//                                     <p>
//                                         No recommendations available.
//                                     </p>
//                                 ) : (
//                                     insights.recommendations.map(
//                                         (item, index) => (
//                                             <p key={index}>
//                                                 • {item}
//                                             </p>
//                                         )
//                                     )
//                                 )}
//                             </div>

//                             <p className="insights-disclaimer">
//                                 These findings are based on AI-simulated
//                                 persona responses, not actual user feedback.
//                             </p>
//                         </div>
//                     )}

//                     {/* Disclaimer */}
//                     <p className="survey-disclaimer">
//                         These responses represent simulated persona
//                         perspectives and should be validated with
//                         real users before making product decisions.
//                     </p>
//                 </section>
//             )}
//         </div>
//     );
// }

// export default SurveyMode;
//2

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SurveyMode.css";
import { jsPDF } from "jspdf";

function SurveyMode() {
    const navigate = useNavigate();

    const [personas, setPersonas] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [questions, setQuestions] = useState([""]);
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [insights, setInsights] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insightsError, setInsightsError] = useState("");

    // Load saved personas
    useEffect(() => {
        try {
            const savedPersonas = JSON.parse(
                localStorage.getItem("syntheticPersonas") || "[]"
            );

            if (Array.isArray(savedPersonas)) {
                setPersonas(savedPersonas);
            } else {
                setError("Saved persona data is invalid.");
            }
        } catch (err) {
            console.error("Load personas error:", err);
            setError("Unable to load saved personas.");
        }
    }, []);

    // Select or deselect a persona
    const togglePersona = (personaId) => {
        setSelectedIds((previous) =>
            previous.includes(personaId)
                ? previous.filter((id) => id !== personaId)
                : [...previous, personaId]
        );
    };

    // Add a survey question
    const addQuestion = () => {
        if (questions.length < 10) {
            setQuestions((previous) => [...previous, ""]);
        }
    };

    // Update a question
    const updateQuestion = (index, value) => {
        setQuestions((previous) =>
            previous.map((question, i) =>
                i === index ? value : question
            )
        );
    };

    // Remove a question
    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions((previous) =>
                previous.filter((_, i) => i !== index)
            );
        }
    };

    // Generate survey responses
    const generateSurvey = async () => {
        setError("");
        setSuccess("");
        setResults([]);
        setInsights(null);
        setInsightsError("");

        const validQuestions = questions
            .map((question) => question.trim())
            .filter(Boolean);

        if (selectedIds.length === 0) {
            setError("Please select at least one persona.");
            return;
        }

        if (validQuestions.length === 0) {
            setError("Please enter at least one survey question.");
            return;
        }

        if (validQuestions.length > 10) {
            setError("Maximum 10 questions are allowed.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/personas/survey",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personaIds: selectedIds,
                        questions: validQuestions,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to generate survey."
                );
            }

            const surveyResults = data.results || [];
            setResults(surveyResults);

            setSuccess(
                `Survey completed for ${
                    data.totalPersonas ?? surveyResults.length
                } synthetic personas.`
            );
        } catch (err) {
            console.error("Survey Error:", err);
            setError(
                err.message || "Unable to generate survey."
            );
        } finally {
            setLoading(false);
        }
    };

    // Generate research insights from survey responses
    const generateResearchInsights = async () => {
        setInsightsError("");
        setInsights(null);

        if (!results.length) {
            setInsightsError(
                "Generate survey responses first."
            );
            return;
        }

        try {
            setInsightsLoading(true);

            const surveyQuestions = (
                results[0]?.answers || []
            ).map((item) => item.question);

            const response = await fetch(
                "http://localhost:5000/api/personas/insights",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        results,
                        questions: surveyQuestions,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to extract insights."
                );
            }

            if (!data.insights) {
                throw new Error(
                    "No insights were returned by the server."
                );
            }

            setInsights(data.insights);
        } catch (err) {
            console.error(
                "Insight Extraction Error:",
                err
            );

            setInsightsError(
                err.message ||
                    "Unable to generate research insights."
            );
        } finally {
            setInsightsLoading(false);
        }
    };

    // Download Research Report as PDF
    const downloadResearchReport = () => {
        if (!results.length || !insights) {
            setInsightsError(
                "Generate survey responses and research insights first."
            );
            return;
        }

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        let y = 20;

        const addText = (text, options = {}) => {
            const {
                size = 10,
                bold = false,
                gap = 6,
            } = options;

            doc.setFont("helvetica", bold ? "bold" : "normal");
            doc.setFontSize(size);

            const lines = doc.splitTextToSize(
                String(text ?? "Not available"),
                pageWidth - 30
            );

            const requiredHeight =
                lines.length * (size * 0.45) + gap;

            if (y + requiredHeight > pageHeight - 15) {
                doc.addPage();
                y = 20;
            }

            doc.text(lines, 15, y);
            y += requiredHeight;
        };

        const addSection = (title) => {
            y += 3;
            addText(title, { size: 14, bold: true, gap: 8 });
        };

        // Report title
        addText("Smart Hostel Life App", {
            size: 20,
            bold: true,
            gap: 9,
        });

        addText("AI-Powered Synthetic User Research Report", {
            size: 14,
            bold: true,
            gap: 8,
        });

        addText(`Generated on: ${new Date().toLocaleDateString()}`);
        addText(`Personas surveyed: ${results.length}`);
        addText(
            `Questions asked: ${results[0]?.answers?.length || 0}`
        );

        // Persona profiles
        addSection("1. Persona Profiles");

        results.forEach((result, index) => {
            const profile = personas.find(
                (persona) =>
                    String(persona._id) ===
                    String(result.personaId || result._id)
            );

            addText(
                `${index + 1}. ${
                    result.name || profile?.name || "Persona"
                }`,
                { bold: true }
            );

            addText(
                `Age: ${profile?.age ?? "Not available"} | Occupation: ${
                    result.occupation ||
                    profile?.occupation ||
                    "Not available"
                }`
            );

            addText(
                `Personality: ${
                    profile?.personalityTraits?.join(", ") ||
                    "Not available"
                }`
            );

            addText(
                `Behavioral patterns: ${
                    profile?.behavioralPatterns?.join(", ") ||
                    "Not available"
                }`
            );
        });

        // Survey response highlights
        addSection("2. Survey Response Highlights");

        results.forEach((result) => {
            addText(result.name || "Synthetic Persona", {
                bold: true,
            });

            (result.answers || []).forEach((item, index) => {
                addText(`Q${index + 1}: ${item.question}`);
                addText(`Response: ${item.answer}`);
            });
        });

        // Research summary
        addSection("3. Research Insight Summary");
        addText(insights.summary || "No summary available.");

        // Sentiment breakdown
        addSection("4. Sentiment Breakdown");

        const sentiment = insights.sentiment || {};

        addText(`Positive: ${sentiment.positive ?? "N/A"}`);
        addText(`Neutral: ${sentiment.neutral ?? "N/A"}`);
        addText(`Negative: ${sentiment.negative ?? "N/A"}`);

        if (sentiment.summary) {
            addText(sentiment.summary);
        }

        // Recurring themes
        addSection("5. Theme Clusters");

        (insights.recurringThemes || []).forEach((item) => {
            addText(item.theme || "Theme", { bold: true });
            addText(item.evidence || "No evidence provided.");
            addText(
                `Persona frequency: ${item.frequency ?? "N/A"}`
            );
        });

        // Key persona quotes
        addSection("6. Key Persona Quotes");

        results.forEach((result) => {
            const firstAnswer = result.answers?.find(
                (item) => item.answer
            );

            if (firstAnswer) {
                addText(
                    `${result.name || "Persona"} — "${firstAnswer.answer}"`
                );
            }
        });

        // Agreement and disagreement
        addSection("7. Agreement Patterns");

        (insights.agreement || []).forEach((item) => {
            addText(`- ${item}`);
        });

        if (!insights.agreement?.length) {
            addText("No agreement findings available.");
        }

        addSection("8. Disagreement Patterns");

        (insights.disagreements || []).forEach((item) => {
            addText(`- ${item}`);
        });

        if (!insights.disagreements?.length) {
            addText("No disagreement findings available.");
        }

        // Adoption insights
        addSection("9. Product Adoption Insights");

        (insights.adoptionInsights || []).forEach((item) => {
            addText(item.name || "Product Feature", {
                bold: true,
            });
            addText(
                `Adoption likelihood: ${item.likelihood || "N/A"}`
            );
            addText(
                item.reasoning || "No reasoning provided."
            );
        });

        if (!insights.adoptionInsights?.length) {
            addText("No adoption insights available.");
        }

        // Product recommendations
        addSection("10. Recommendations");

        (insights.recommendations || []).forEach((item) => {
            addText(`- ${item}`);
        });

        if (!insights.recommendations?.length) {
            addText("No recommendations available.");
        }

        doc.save("synthetic-user-research-report.pdf");
    };

    return (
        <div className="survey-page">
            {/* Page Header */}
            <header className="survey-header">
                <div>
                    <p className="survey-eyebrow">
                        PRODUCT RESEARCH
                    </p>

                    <h1>Survey Mode</h1>

                    <p>
                        Ask the same questions to multiple synthetic
                        personas and compare their responses.
                    </p>
                </div>

                <button
                    type="button"
                    className="survey-back-btn"
                    onClick={() => navigate("/personas")}
                >
                    ← Personas
                </button>
            </header>

            {/* Error Message */}
            {error && (
                <div className="survey-alert survey-error">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="survey-alert survey-success">
                    {success}
                </div>
            )}

            {/* Step 1: Select Personas */}
            <section className="survey-section">
                <div className="survey-section-heading">
                    <div>
                        <h2>1. Select Personas</h2>
                        <p>
                            Choose which synthetic users should
                            answer your questions.
                        </p>
                    </div>

                    <span className="survey-count">
                        {selectedIds.length} selected
                    </span>
                </div>

                {personas.length === 0 ? (
                    <div className="survey-empty">
                        <h3>No personas available</h3>
                        <p>
                            Generate personas first before
                            starting a survey.
                        </p>

                        <button
                            type="button"
                            className="survey-primary-btn"
                            onClick={() => navigate("/personas")}
                        >
                            Generate Personas
                        </button>
                    </div>
                ) : (
                    <div className="survey-persona-grid">
                        {personas.map((persona) => (
                            <label
                                key={persona._id}
                                className={`survey-persona-card ${
                                    selectedIds.includes(persona._id)
                                        ? "selected"
                                        : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(
                                        persona._id
                                    )}
                                    onChange={() =>
                                        togglePersona(persona._id)
                                    }
                                />

                                <div className="survey-avatar">
                                    {persona.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3>{persona.name}</h3>

                                    <p>
                                        {persona.age} years ·{" "}
                                        {persona.occupation}
                                    </p>

                                    <span>
                                        {(
                                            persona.personalityTraits || []
                                        )
                                            .slice(0, 2)
                                            .join(" · ")}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </section>

            {/* Step 2: Add Questions */}
            <section className="survey-section">
                <div className="survey-section-heading">
                    <div>
                        <h2>2. Add Survey Questions</h2>
                        <p>
                            Every selected persona will answer
                            the same questions.
                        </p>
                    </div>

                    <span className="survey-count">
                        {questions.length}/10
                    </span>
                </div>

                <div className="survey-question-list">
                    {questions.map((question, index) => (
                        <div
                            className="survey-question-row"
                            key={index}
                        >
                            <span className="survey-question-number">
                                {index + 1}
                            </span>

                            <input
                                type="text"
                                value={question}
                                onChange={(event) =>
                                    updateQuestion(
                                        index,
                                        event.target.value
                                    )
                                }
                                placeholder={`Enter question ${index + 1}`}
                                maxLength={500}
                            />

                            <button
                                type="button"
                                className="survey-remove-btn"
                                onClick={() =>
                                    removeQuestion(index)
                                }
                                disabled={questions.length === 1}
                                aria-label={`Remove question ${index + 1}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="survey-add-btn"
                    onClick={addQuestion}
                    disabled={questions.length >= 10}
                >
                    + Add Question
                </button>

                <div className="survey-generate-area">
                    <button
                        type="button"
                        className="survey-primary-btn"
                        onClick={generateSurvey}
                        disabled={
                            loading ||
                            personas.length === 0 ||
                            selectedIds.length === 0
                        }
                    >
                        {loading
                            ? "Generating Responses..."
                            : "Generate Survey"}
                    </button>

                    <p>
                        Responses are AI-generated simulations,
                        not actual feedback from real users.
                    </p>
                </div>
            </section>

            {/* Step 3: Compare Survey Responses */}
            {results.length > 0 && (
                <section className="survey-section">
                    <div className="survey-section-heading">
                        <div>
                            <h2>3. Compare Responses</h2>
                            <p>
                                Compare how each synthetic persona
                                answers every question.
                            </p>
                        </div>
                    </div>

                    <div className="survey-results-wrapper">
                        <table className="survey-results-table">
                            <thead>
                                <tr>
                                    <th>Survey Question</th>

                                    {results.map((persona, index) => (
                                        <th
                                            key={
                                                persona.personaId ||
                                                persona._id ||
                                                index
                                            }
                                        >
                                            <div>{persona.name}</div>
                                            <small>
                                                {persona.occupation}
                                            </small>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {(results[0]?.answers || []).map(
                                    (answer, questionIndex) => (
                                        <tr key={questionIndex}>
                                            <td className="survey-question-cell">
                                                <strong>
                                                    Q{questionIndex + 1}
                                                </strong>
                                                <p>{answer.question}</p>
                                            </td>

                                            {results.map(
                                                (persona, index) => (
                                                    <td
                                                        key={
                                                            persona.personaId ||
                                                            persona._id ||
                                                            index
                                                        }
                                                    >
                                                        {persona.answers?.[
                                                            questionIndex
                                                        ]?.answer ||
                                                            "No answer available."}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Generate Research Insights Button */}
                    <div className="insights-action">
                        <button
                            type="button"
                            className="survey-primary-btn"
                            onClick={generateResearchInsights}
                            disabled={insightsLoading || loading}
                        >
                            {insightsLoading
                                ? "Analyzing Responses..."
                                : "Generate Research Insights"}
                        </button>

                        {insightsError && (
                            <p className="insights-error">
                                {insightsError}
                            </p>
                        )}
                    </div>

                    {/* Research Insights Dashboard */}
                    {insights && (
                        <div className="insights-dashboard">
                            <div
                                className="insights-header-row"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <h2>Research Insights</h2>

                                <button
                                    type="button"
                                    className="survey-primary-btn"
                                    onClick={downloadResearchReport}
                                    style={{
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                    }}
                                >
                                    📥 Download PDF Report
                                </button>
                            </div>

                            {/* Overall Summary */}
                            <div className="insights-card">
                                <h3>Overall Summary</h3>
                                <p>
                                    {insights.summary ||
                                        "No summary available."}
                                </p>
                            </div>

                            {/* Sentiment Analysis with Visual Bar Chart */}
                            <div className="insights-card">
                                <h3>Sentiment Analysis</h3>

                                {(() => {
                                    const sentimentItems = [
                                        {
                                            label: "Positive",
                                            value:
                                                Number(
                                                    insights.sentiment?.positive
                                                ) || 0,
                                            className: "positive",
                                        },
                                        {
                                            label: "Neutral",
                                            value:
                                                Number(
                                                    insights.sentiment?.neutral
                                                ) || 0,
                                            className: "neutral",
                                        },
                                        {
                                            label: "Negative",
                                            value:
                                                Number(
                                                    insights.sentiment?.negative
                                                ) || 0,
                                            className: "negative",
                                        },
                                    ];

                                    const maxValue = Math.max(
                                        1,
                                        ...sentimentItems.map(
                                            (item) => item.value
                                        )
                                    );

                                    return (
                                        <>
                                            <div className="sentiment-grid">
                                                {sentimentItems.map((item) => (
                                                    <div key={item.label}>
                                                        <strong>
                                                            {item.value}
                                                        </strong>
                                                        <span>{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="sentiment-chart">
                                                <h4>
                                                    Sentiment Distribution
                                                </h4>

                                                {sentimentItems.map((item) => (
                                                    <div
                                                        className="sentiment-chart-row"
                                                        key={item.label}
                                                    >
                                                        <div className="sentiment-chart-label">
                                                            <span>
                                                                {item.label}
                                                            </span>
                                                            <strong>
                                                                {item.value}
                                                            </strong>
                                                        </div>

                                                        <div
                                                            className="sentiment-bar-track"
                                                            role="img"
                                                            aria-label={`${item.label}: ${item.value}`}
                                                        >
                                                            <div
                                                                className={`sentiment-bar-fill ${item.className}`}
                                                                style={{
                                                                    width: `${
                                                                        (item.value /
                                                                            maxValue) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {insights.sentiment?.summary && (
                                                <p>
                                                    {insights.sentiment.summary}
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Recurring Themes */}
                            <div className="insights-card">
                                <h3>Recurring Themes</h3>

                                {(insights.recurringThemes || []).length === 0 ? (
                                    <p>
                                        No recurring themes were identified.
                                    </p>
                                ) : (
                                    insights.recurringThemes.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="insight-item"
                                            >
                                                <strong>
                                                    {item.theme}
                                                </strong>
                                                <p>{item.evidence}</p>
                                                <small>
                                                    Supported by{" "}
                                                    {item.frequency ?? "N/A"}{" "}
                                                    persona(s)
                                                </small>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            {/* Agreement */}
                            <div className="insights-card">
                                <h3>Agreement</h3>

                                {(insights.agreement || []).length === 0 ? (
                                    <p>
                                        No common agreement identified.
                                    </p>
                                ) : (
                                    insights.agreement.map(
                                        (item, index) => (
                                            <p key={index}>• {item}</p>
                                        )
                                    )
                                )}
                            </div>

                            {/* Disagreements */}
                            <div className="insights-card">
                                <h3>Disagreements</h3>

                                {(insights.disagreements || []).length === 0 ? (
                                    <p>
                                        No clear disagreements identified.
                                    </p>
                                ) : (
                                    insights.disagreements.map(
                                        (item, index) => (
                                            <p key={index}>• {item}</p>
                                        )
                                    )
                                )}
                            </div>

                            {/* Adoption Insights */}
                            <div className="insights-card">
                                <h3>Product Adoption Insights</h3>

                                {(insights.adoptionInsights || []).length === 0 ? (
                                    <p>
                                        No adoption insights available.
                                    </p>
                                ) : (
                                    insights.adoptionInsights.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="insight-item"
                                            >
                                                <strong>
                                                    {item.name}
                                                </strong>
                                                <p>
                                                    Adoption likelihood:{" "}
                                                    {item.likelihood}
                                                </p>
                                                <p>
                                                    {item.reasoning}
                                                </p>
                                            </div>
                                        )
                                    )
                                )}
                            </div>

                            {/* Product Recommendations */}
                            <div className="insights-card">
                                <h3>Product Recommendations</h3>

                                {(insights.recommendations || []).length === 0 ? (
                                    <p>
                                        No recommendations available.
                                    </p>
                                ) : (
                                    insights.recommendations.map(
                                        (item, index) => (
                                            <p key={index}>• {item}</p>
                                        )
                                    )
                                )}
                            </div>

                            <p className="insights-disclaimer">
                                These findings are based on AI-simulated
                                persona responses, not actual user feedback.
                            </p>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <p className="survey-disclaimer">
                        These responses represent simulated persona
                        perspectives and should be validated with
                        real users before making product decisions.
                    </p>
                </section>
            )}
        </div>
    );
}

export default SurveyMode;
