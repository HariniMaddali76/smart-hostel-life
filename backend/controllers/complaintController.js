const Complaint = require("../models/Complaint");


// Create a new complaint
const createComplaint = async (req, res) => {
    try {
        const {
            student,
            category,
            description
        } = req.body;

        const complaint = await Complaint.create({
            student,
            category,
            description
        });

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit complaint",
            error: error.message
        });
    }
};


// Get complaints of a student
const getStudentComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.params.studentId
        }).sort({ createdAt: -1 });

        res.status(200).json(complaints);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch student complaints",
            error: error.message
        });
    }
};


// Get all complaints for admin
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
};


// Update complaint status
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        complaint.status = status;

        await complaint.save();

        res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update complaint status",
            error: error.message
        });
    }
};


module.exports = {
    createComplaint,
    getStudentComplaints,
    getAllComplaints,
    updateComplaintStatus
};