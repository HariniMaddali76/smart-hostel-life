const { GoogleGenerativeAI } = require("@google/generative-ai");
const Persona = require("../models/Persona");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3.5-flash-lite";

// =====================================================
// 1. GENERATE SYNTHETIC PERSONAS
// =====================================================

const generatePersonas = async (req, res) => {
    try {
        const {
            productName,
            productDescription,
            targetAudience,
            researchObjectives
        } = req.body;

        if (
            !productName ||
            !productDescription ||
            !targetAudience ||
            !researchObjectives
        ) {
            return res.status(400).json({
                message: "All experiment details are required."
            });
        }

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME
        });

        const prompt = `
You are a synthetic user research persona generation agent.

Generate exactly 4 diverse but realistic synthetic personas
for the following product research experiment.

PRODUCT:
${productName}

PRODUCT DESCRIPTION:
${productDescription}

TARGET AUDIENCE:
${targetAudience}

RESEARCH OBJECTIVES:
${researchObjectives}

IMPORTANT:
If the product is a college hostel management application,
the target users are college students living in residential
hostels.

Do NOT generate tourists, backpackers, travelers,
digital nomads, or hotel guests unless explicitly requested.

Each persona must have:
- name
- age
- occupation
- personalityTraits (array of strings)
- behavioralPatterns (array of strings)
- psychologicalProfile containing goals, motivations,
  frustrations and concerns (arrays of strings)

Make the personas meaningfully different from each other.
These are synthetic research personas, not real people.

Return ONLY valid JSON without markdown or code fences.

Use this structure:
{
  "personas": [
    {
      "name": "string",
      "age": 0,
      "occupation": "string",
      "personalityTraits": ["string"],
      "behavioralPatterns": ["string"],
      "psychologicalProfile": {
        "goals": ["string"],
        "motivations": ["string"],
        "frustrations": ["string"],
        "concerns": ["string"]
      }
    }
  ]
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let parsed;

        try {
            const cleanedText = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            parsed = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Persona JSON parsing error:", text);

            return res.status(500).json({
                message: "AI returned an invalid persona format."
            });
        }

        if (
            !parsed.personas ||
            !Array.isArray(parsed.personas) ||
            parsed.personas.length !== 4
        ) {
            return res.status(500).json({
                message: "Invalid persona data received from AI."
            });
        }

        const savedPersonas = await Promise.all(
            parsed.personas.map((persona) => Persona.create(persona))
        );

        return res.json({
            message: "Personas generated and saved successfully.",
            personas: savedPersonas
        });

    } catch (error) {
        console.error("Persona Generation Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// 2. CHAT WITH SYNTHETIC PERSONA — INTERVIEW MODE
// =====================================================

const chatWithPersona = async (req, res) => {
    try {
        const { personaId, message } = req.body;

        if (
            !personaId ||
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                message: "Persona ID and message are required."
            });
        }

        const persona = await Persona.findById(personaId);

        if (!persona) {
            return res.status(404).json({
                message: "Persona not found."
            });
        }

        const profile = persona.psychologicalProfile || {};

        const previousConversation =
            (persona.conversationHistory || [])
                .map((chat) => {
                    const speaker =
                        chat.role === "user" ? "User" : persona.name;

                    return `${speaker}: ${chat.message}`;
                })
                .join("\n");

        const prompt = `
You are simulating the following synthetic research persona.

PERSONA PROFILE:
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}

Personality Traits:
${(persona.personalityTraits || []).join(", ")}

Behavioral Patterns:
${(persona.behavioralPatterns || []).join(", ")}

Goals:
${(profile.goals || []).join(", ")}

Motivations:
${(profile.motivations || []).join(", ")}

Frustrations:
${(profile.frustrations || []).join(", ")}

Concerns:
${(profile.concerns || []).join(", ")}

PREVIOUS CONVERSATION:
${previousConversation || "No previous conversation."}

NEW USER MESSAGE:
${message.trim()}

INSTRUCTIONS:
1. Respond naturally as 
${persona.name}.
2. Maintain the same personality and behavioral patterns.
3. Use previous conversation context when relevant.
4. Keep opinions consistent with the persona profile.
5. Do not invent major personal characteristics.
6. Answer the user's question directly.
`;

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME
        });

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        persona.conversationHistory.push({
            role: "user",
            message: message.trim(),
            timestamp: new Date()
        });

        persona.conversationHistory.push({
            role: "persona",
            message: response,
            timestamp: new Date()
        });

        await persona.save();

        return res.json({
            persona: {
                id: persona._id,
                name: persona.name
            },
            response,
            conversationHistory: persona.conversationHistory
        });

    } catch (error) {
        console.error("Persona Chat Error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


// =====================================================
// 3. SURVEY MODE — ALL SELECTED PERSONAS ANSWER
// =====================================================

const surveyWithPersonas = async (req, res) => {
    try {
        const { personaIds, questions } = req.body;

        if (
            !Array.isArray(personaIds) ||
            personaIds.length === 0 ||
            !Array.isArray(questions) ||
            questions.length === 0
        ) {
            return res.status(400).json({
                message: "Select personas and provide survey questions."
            });
        }

        if (personaIds.length > 10 || questions.length > 10) {
            return res.status(400).json({
                message: "Maximum 10 personas and 10 questions are allowed."
            });
        }

        if (
            personaIds.some(
                (id) => typeof id !== "string" || !id.trim()
            ) ||
            questions.some(
                (question) =>
                    typeof question !== "string" ||
                    !question.trim()
            )
        ) {
            return res.status(400).json({
                message: "Persona IDs and questions must be valid."
            });
        }

        if (new Set(personaIds).size !== personaIds.length) {
            return res.status(400).json({
                message: "Duplicate persona IDs are not allowed."
            });
        }

        const cleanedQuestions = questions.map(
            (question) => question.trim()
        );

        const personas = await Persona.find({
            _id: { $in: personaIds }
        });

        if (personas.length !== personaIds.length) {
            return res.status(404).json({
                message: "One or more personas were not found."
            });
        }

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME
        });

        const results = await Promise.all(
            personas.map(async (persona) => {
                const profile = persona.psychologicalProfile || {};

                const prompt = `
You are simulating a SYNTHETIC user for product research.

PERSONA:
Name: ${persona.name}
Age: ${persona.age}
Occupation: ${persona.occupation}

Personality Traits:
${(persona.personalityTraits || []).join(", ")}

Behavioral Patterns:
${(persona.behavioralPatterns || []).join(", ")}

Goals:
${(profile.goals || []).join(", ")}

Motivations:
${(profile.motivations || []).join(", ")}

Frustrations:
${(profile.frustrations || []).join(", ")}

Concerns:
${(profile.concerns || []).join(", ")}

SURVEY QUESTIONS:
${JSON.stringify(cleanedQuestions, null, 2)}

INSTRUCTIONS:
1. Answer every question in the same order.
2. Return exactly ${cleanedQuestions.length} answers.
3. Preserve the original question wording.
4. Answer according to this persona's profile.
5. Give realistic and meaningful responses.
6. Do not invent product features or personal facts.
7. These are simulated opinions, not actual user feedback.
8. Return ONLY valid JSON without markdown or code fences.

Required format:
{
  "answers": [
    {
      "question": "original question",
      "answer": "persona response"
    }
  ]
}
`;

                const result = await model.generateContent(prompt);
                const text = result.response.text();

                let parsed;

                try {
                    const cleanedText = text
                        .replace(/^```json\s*/i, "")
                        .replace(/^```\s*/i, "")
                        .replace(/\s*```$/, "")
                        .trim();

                    parsed = JSON.parse(cleanedText);
                } catch (parseError) {
                    console.error(
                        `Survey JSON parsing error for ${persona.name}:`,
                        text
                    );

                    throw new Error(
                        `Invalid AI survey response for ${persona.name}.`
                    );
                }

                if (
                    !parsed.answers ||
                    !Array.isArray(parsed.answers) ||
                    parsed.answers.length !== cleanedQuestions.length
                ) {
                    throw new Error(
                        `Incomplete survey answers for ${persona.name}.`
                    );
                }

                const answers = parsed.answers.map((item, index) => {
                    if (
                        !item ||
                        typeof item.answer !== "string" ||
                        !item.answer.trim()
                    ) {
                        throw new Error(
                            `Missing answer for ${persona.name}, question ${index + 1}.`
                        );
                    }

                    return {
                        question: cleanedQuestions[index],
                        answer: item.answer.trim()
                    };
                });

                return {
                    personaId: persona._id,
                    name: persona.name,
                    age: persona.age,
                    occupation: persona.occupation,
                    answers
                };
            })
        );

        return res.json({
            message: "Survey responses generated successfully.",
            questions: cleanedQuestions,
            totalPersonas: results.length,
            results
        });

    } catch (error) {
        console.error("Survey Mode Error:", error);

        return res.status(500).json({
            message: error.message || "Failed to generate survey responses."
        });
    }
};


// =====================================================
// EXTRACT INSIGHTS
// =====================================================

const extractInsights = async (req, res) => {
    try {
        const { results, questions } = req.body;

        if (
            !Array.isArray(results) ||
            results.length === 0 ||
            !Array.isArray(questions) ||
            questions.length === 0
        ) {
            return res.status(400).json({
                message: "Survey results and questions are required."
            });
        }

        if (results.length > 10 || questions.length > 10) {
            return res.status(400).json({
                message: "Maximum 10 personas and 10 questions are allowed."
            });
        }

        const validResults = results.every(
            (persona) =>
                persona &&
                typeof persona.name === "string" &&
                Array.isArray(persona.answers) &&
                persona.answers.every(
                    (item) =>
                        item &&
                        typeof item.question === "string" &&
                        typeof item.answer === "string"
                )
        );

        if (!validResults) {
            return res.status(400).json({
                message: "Invalid survey response data."
            });
        }

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME
        });

        const prompt = `
You are an AI-powered synthetic user research insight extraction agent.

Analyze the following simulated survey responses.

SURVEY QUESTIONS:
${JSON.stringify(questions, null, 2)}

PERSONA RESPONSES:
${JSON.stringify(results, null, 2)}

TASKS:
1. Identify recurring themes across the answers.
2. Analyze overall sentiment as positive, neutral, or negative.
3. Identify areas where personas agree.
4. Identify differences or disagreements between personas.
5. Estimate each persona's stated willingness to use the product.
6. Explain the reasoning behind each persona's adoption estimate.
7. Suggest actionable product improvements.
8. Provide a concise overall research summary.

RULES:
- Use only evidence present in the supplied responses.
- Do not invent statistics, quotes, or findings.
- Distinguish observed response patterns from interpretations.
- Adoption likelihood must be High, Medium, or Low.
- If a response does not indicate willingness, use Medium and
  clearly explain that the evidence is insufficient.
- These are AI-generated simulations, not real-user research.
- Do not claim that simulated sentiment represents real customers.
- Return ONLY valid JSON. Do not use markdown or code fences.

REQUIRED JSON FORMAT:
{
  "summary": "Overall research summary",
  "recurringThemes": [
    {
      "theme": "Theme name",
      "evidence": "Explanation based on responses",
      "frequency": 2
    }
  ],
  "sentiment": {
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "summary": "Overall sentiment explanation"
  },
  "agreement": [
    "Finding supported by multiple persona responses"
  ],
  "disagreements": [
    "Difference between persona responses"
  ],
  "adoptionInsights": [
    {
      "name": "Persona name",
      "likelihood": "High",
      "reasoning": "Reason based on that persona's answers"
    }
  ],
  "recommendations": [
    "Actionable product improvement"
  ]
}

For sentiment counts, classify each individual answer once.
The three sentiment counts must add up to the total number
of answers analyzed.
For theme frequency, count distinct personas whose responses
support that theme.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let insights;

        try {
            const cleanedText = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/, "")
                .trim();

            insights = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Insight JSON parsing error:", text);

            return res.status(500).json({
                message: "AI returned an invalid insight format."
            });
        }

        // Calculate overall and occupation-wise adoption scores
        const adoptionItems = Array.isArray(insights.adoptionInsights)
            ? insights.adoptionInsights
            : [];

        const scoreMap = {
            High: 85,
            Medium: 60,
            Low: 30
        };

        const scoredPersonas = adoptionItems.map((item) => {
            const score = scoreMap[item.likelihood] ?? 60;

            const matchedPersona = results.find(
                (persona) => persona.name === item.name
            );

            return {
                name: item.name,
                likelihood: item.likelihood,
                score,
                reasoning: item.reasoning,
                personaGroup: matchedPersona?.occupation || "Other"
            };
        });

        const totalScore = scoredPersonas.length
            ? Math.round(
                scoredPersonas.reduce(
                    (sum, persona) => sum + persona.score,
                    0
                ) / scoredPersonas.length
            )
            : null;

        const groupMap = {};

        scoredPersonas.forEach((persona) => {
            if (!groupMap[persona.personaGroup]) {
                groupMap[persona.personaGroup] = [];
            }

            groupMap[persona.personaGroup].push(persona);
        });

        const personaGroupScores = Object.entries(groupMap).map(
            ([group, members]) => ({
                group,
                personaCount: members.length,
                averageAdoptionScore: Math.round(
                    members.reduce(
                        (sum, persona) => sum + persona.score,
                        0
                    ) / members.length
                ),
                reasoning: members
                    .map(
                        (persona) =>
                            `${persona.name}: ${persona.reasoning}`
                    )
                    .join(" ")
            })
        );

        insights.productValidation = {
            overallAdoptionScore: totalScore,
            totalPersonasScored: scoredPersonas.length,
            scoringMethod:
                "High = 85, Medium = 60, Low = 30; scores are derived from AI-estimated likelihoods, not measured real-user behavior.",
            personaScores: scoredPersonas,
            personaGroupScores
        };

        const requiredArrays = [
            "recurringThemes",
            "agreement",
            "disagreements",
            "adoptionInsights",
            "recommendations"
        ];

        const validInsights =
            typeof insights.summary === "string" &&
            insights.sentiment &&
            typeof insights.sentiment === "object" &&
            requiredArrays.every(
                (key) => Array.isArray(insights[key])
            );

        if (!validInsights) {
            return res.status(500).json({
                message: "AI returned incomplete research insights."
            });
        }

        return res.json({
            message: "Research insights generated successfully.",
            insights,
            disclaimer:
                "These insights analyze simulated AI persona responses, not actual user feedback."
        });
    } catch (error) {
        console.error("Insight Extraction Error:", error);

        return res.status(500).json({
            message: error.message ||
                "Failed to extract research insights."
        });
    }
};

module.exports = {
    generatePersonas,
    chatWithPersona,
    surveyWithPersonas,
    extractInsights
};