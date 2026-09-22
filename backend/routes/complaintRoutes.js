const express = require("express");

const {
    createComplaint,
    getStudentComplaints,
    getAllComplaints,
    updateComplaintStatus
} = require("../controllers/complaintController");

const router = express.Router();


// Student - Create complaint
router.post("/", createComplaint);


// Student - Get own complaints
router.get("/student/:studentId", getStudentComplaints);


// Admin - Get all complaints
router.get("/", getAllComplaints);
router.get("/student/:studentId", getStudentComplaints);


// Admin - Update complaint status
router.put("/:id/status", updateComplaintStatus);


module.exports = router;