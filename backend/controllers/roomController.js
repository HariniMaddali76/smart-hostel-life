const Room = require("../models/Room");
const User = require("../models/User");


// Create a new room
const createRoom = async (req, res) => {
    try {
        const {
            roomNumber,
            block,
            floor,
            capacity
        } = req.body;

        const existingRoom = await Room.findOne({ roomNumber });

        if (existingRoom) {
            return res.status(400).json({
                message: "Room already exists"
            });
        }

        const room = await Room.create({
            roomNumber,
            block,
            floor,
            capacity
        });

        res.status(201).json({
            message: "Room created successfully",
            room
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create room",
            error: error.message
        });
    }
};


// Get all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate("students", "name email");

        res.status(200).json(rooms);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch rooms",
            error: error.message
        });
    }
};


// Get single room
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate("students", "name email");

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        res.status(200).json(room);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch room",
            error: error.message
        });
    }
};


// Assign student to room
const assignStudentToRoom = async (req, res) => {
    try {
        const { studentId, roomId } = req.body;

        const student = await User.findById(studentId);
        const room = await Room.findById(roomId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (student.role !== "student") {
            return res.status(400).json({
                message: "Only students can be assigned to rooms"
            });
        }

        if (room.occupiedBeds >= room.capacity) {
            return res.status(400).json({
                message: "Room is already full"
            });
        }

        if (student.room) {
            return res.status(400).json({
                message: "Student is already assigned to a room"
            });
        }

        // Assign room to student
        student.room = room._id;
        await student.save();

        // Add student to room
        room.students.push(student._id);
        room.occupiedBeds += 1;

        await room.save();

        res.status(200).json({
            message: "Student assigned to room successfully",
            student,
            room
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign student",
            error: error.message
        });
    }
};


module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    assignStudentToRoom
};