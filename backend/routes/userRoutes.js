const express = require("express");

const {
    getStudents,getStudentRoom
} = require("../controllers/userController");

const router = express.Router();



// Get all students
router.get("/students", getStudents);
router.get("/students/:id/room", getStudentRoom);


module.exports = router;