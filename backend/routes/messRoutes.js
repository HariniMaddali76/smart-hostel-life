const express = require("express");

const {
    createMessMenu,
    getMessMenus,
    deleteMessMenu
} = require("../controllers/messController");

const router = express.Router();


// Add mess menu
router.post("/", createMessMenu);


// Get all mess menus
router.get("/", getMessMenus);


// Delete mess menu
router.delete("/:id", deleteMessMenu);


module.exports = router;