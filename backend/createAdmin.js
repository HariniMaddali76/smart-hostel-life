const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin";

            await existingAdmin.save();

            console.log("Admin updated successfully!");
        } else {
            await User.create({
                name: "Admin",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: "admin"
            });

            console.log("Admin created successfully!");
        }

        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

createAdmin();