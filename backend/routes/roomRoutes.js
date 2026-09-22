const express = require("express");

const {
    createRoom,
    getRooms,
    getRoomById,
    assignStudentToRoom
} = require("../controllers/roomController");

const router = express.Router();


// Create room
router.post("/", createRoom);


// Get all rooms
router.get("/", getRooms);


// Assign student to room
router.post("/assign", assignStudentToRoom);


// Get room by ID
router.get("/:id", getRoomById);


module.exports = router;