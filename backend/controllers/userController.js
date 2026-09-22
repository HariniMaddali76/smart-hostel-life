const User = require("../models/User");


// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await User.find(
            { role: "student" },
            "name email room"
        ).populate("room", "roomNumber block floor");

        res.status(200).json(students);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};
// Get logged-in student's room details
const getStudentRoom = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .populate({
                path: "room",
                populate: {
                    path: "students",
                    select: "name email"
                }
            });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!student.room) {
            return res.status(404).json({
                message: "Student is not assigned to any room"
            });
        }

        res.status(200).json({
            room: student.room
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch student room",
            error: error.message
        });
    }
};


module.exports = {
    getStudents,
    getStudentRoom
};