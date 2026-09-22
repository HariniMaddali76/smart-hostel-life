const mongoose = require("mongoose");

const messMenuSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ]
        },

        meal: {
            type: String,
            required: true,
            enum: [
                "Breakfast",
                "Lunch",
                "Snacks",
                "Dinner"
            ]
        },

        menu: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("MessMenu", messMenuSchema);