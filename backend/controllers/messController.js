const MessMenu = require("../models/MessMenu");


// Add a new mess menu
const createMessMenu = async (req, res) => {
    try {
        const {
            day,
            meal,
            menu
        } = req.body;

        const existingMenu = await MessMenu.findOne({
            day,
            meal
        });

        if (existingMenu) {
            return res.status(400).json({
                message: "Menu already exists for this meal"
            });
        }

        const messMenu = await MessMenu.create({
            day,
            meal,
            menu
        });

        res.status(201).json({
            message: "Mess menu added successfully",
            messMenu
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add mess menu",
            error: error.message
        });
    }
};


// Get all mess menus
const getMessMenus = async (req, res) => {
    try {
        const menus = await MessMenu.find()
            .sort({ createdAt: 1 });

        res.status(200).json(menus);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch mess menus",
            error: error.message
        });
    }
};


// Delete mess menu
const deleteMessMenu = async (req, res) => {
    try {
        const menu = await MessMenu.findById(
            req.params.id
        );

        if (!menu) {
            return res.status(404).json({
                message: "Mess menu not found"
            });
        }

        await menu.deleteOne();

        res.status(200).json({
            message: "Mess menu deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete mess menu",
            error: error.message
        });
    }
};


module.exports = {
    createMessMenu,
    getMessMenus,
    deleteMessMenu
};