const mongoose = require("mongoose");

const personaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true
        },

        occupation: {
            type: String,
            required: true
        },

        personalityTraits: {
            type: [String],
            default: []
        },

        behavioralPatterns: {
            type: [String],
            default: []
        },

        psychologicalProfile: {
            goals: {
                type: [String],
                default: []
            },

            motivations: {
                type: [String],
                default: []
            },

            frustrations: {
                type: [String],
                default: []
            },

            concerns: {
                type: [String],
                default: []
            }
        },

        // Stores previous conversation turns
        conversationHistory: [
            {
                role: {
                    type: String,
                    enum: ["user", "persona"]
                },

                message: {
                    type: String
                },

                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Persona", personaSchema);