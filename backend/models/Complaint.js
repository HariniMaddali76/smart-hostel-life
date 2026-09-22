const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Room",
                "Mess",
                "Maintenance",
                "Electricity",
                "Water",
                "Other"
            ]
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);